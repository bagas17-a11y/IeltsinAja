import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, ArrowRight } from "lucide-react";

export default function OnboardingPhone() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = phone.replace(/\s+/g, "").replace(/^0/, "62");
    if (cleaned.length < 9) { setError("Please enter a valid phone number."); return; }
    if (!user) { navigate("/auth"); return; }

    setLoading(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ phone_number: cleaned })
      .eq("user_id", user.id);
    setLoading(false);

    if (updateError) { setError("Couldn't save your number. Try again."); return; }
    navigate("/pricing-selection");
  };

  return (
    <div className="min-h-screen bg-atmospheric flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-glow-accent/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-tight">
              Eng<span className="text-accent font-medium">volve</span>
            </h1>
            <p className="text-base font-medium text-foreground mt-4">One last thing</p>
            <p className="text-sm text-muted-foreground mt-1">
              We use WhatsApp to process payments and send updates. Enter your number so we can reach you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>WhatsApp number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx or +62xxxxxxxxx"
                  className="pl-10 bg-secondary/50 border-border/50"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">Indonesian number — we'll convert 08xx to +62 automatically.</p>
            </div>

            <Button type="submit" variant="neumorphicPrimary" className="w-full" disabled={loading}>
              {loading ? "Saving..." : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>

            <button
              type="button"
              onClick={() => navigate("/pricing-selection")}
              className="w-full text-xs text-muted-foreground hover:text-foreground text-center py-1"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
