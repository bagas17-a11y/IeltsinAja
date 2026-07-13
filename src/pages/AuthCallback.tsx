import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }

      const userId = session.user.id;

      // Check admin
      const { data: isAdminRole } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (isAdminRole) { navigate("/dashboard"); return; }

      // Wait up to 5s for the profile trigger to create the row
      let profile = null;
      for (let i = 0; i < 5; i++) {
        const { data } = await supabase
          .from("profiles")
          .select("is_verified, subscription_tier")
          .eq("user_id", userId)
          .maybeSingle();
        if (data) { profile = data; break; }
        await new Promise((r) => setTimeout(r, 1000));
      }

      const pricingDest = planParam ? `/pricing-selection?plan=${planParam}` : "/pricing-selection";

      // Brand-new account = created within the last 2 minutes
      const isNewUser = session.user.created_at
        ? Date.now() - new Date(session.user.created_at).getTime() < 120_000
        : false;

      if (!profile || isNewUser) {
        supabase.functions.invoke("send-welcome-email", {
          body: {
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name,
          },
        }).catch(() => {});
        supabase.functions.invoke("send-admin-notification", {
          body: {
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name,
            sign_up_method: "google",
          },
        }).catch(() => {});
        // Collect phone number before pricing for Google users
        navigate("/onboarding/phone");
        return;
      }

      if (!profile.is_verified) { navigate("/waiting-room"); return; }

      // If they came from a plan link, respect that
      if (planParam) { navigate(pricingDest); return; }

      navigate("/dashboard");
    });
  }, [navigate, planParam]);

  return (
    <div className="min-h-screen bg-atmospheric flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
