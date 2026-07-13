import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, full_name, sign_up_method } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get all admin user IDs
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (!adminRoles || adminRoles.length === 0) {
      return new Response(JSON.stringify({ success: true, note: "no admins found" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get admin emails from auth.users via service role
    const adminUserIds = adminRoles.map((r: any) => r.user_id);
    const { data: adminProfiles } = await supabase
      .from("profiles")
      .select("email")
      .in("user_id", adminUserIds);

    const adminEmails = (adminProfiles ?? [])
      .map((p: any) => p.email)
      .filter(Boolean);

    if (adminEmails.length === 0) {
      return new Response(JSON.stringify({ success: true, note: "no admin emails" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const method = sign_up_method === "google" ? "Google Sign-In" : "Email & Password";
    const displayName = full_name || email || "Unknown";
    const adminUrl = "https://engvolve.com/admin/users";

    await resend.emails.send({
      from: "Engvolve Alerts <noreply@engvolve.com>",
      to: adminEmails,
      subject: `New sign-up: ${displayName}`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:500px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0e3860;border-radius:12px 12px 0 0;padding:28px 32px;">
      <p style="color:#FFE4A0;margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:700;">Engvolve Admin Alert</p>
      <h1 style="color:#fff;margin:8px 0 0 0;font-size:22px;font-weight:600;">New user signed up</h1>
    </div>
    <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#6b7280;width:120px;">Name</td>
          <td style="padding:8px 0;color:#111827;font-weight:500;">${displayName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;">Email</td>
          <td style="padding:8px 0;color:#111827;">${email || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;">Method</td>
          <td style="padding:8px 0;color:#111827;">${method}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;">Time</td>
          <td style="padding:8px 0;color:#111827;">${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB</td>
        </tr>
      </table>
      <div style="margin-top:24px;text-align:center;">
        <a href="${adminUrl}" style="display:inline-block;background:#0e3860;color:#FFE4A0;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
          View in Admin Portal →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
