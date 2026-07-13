import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  full_name: string;
  plan_name: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, full_name, plan_name }: VerificationEmailRequest = await req.json();
    if (!email) throw new Error("Email is required");

    const displayName = full_name?.split(" ")[0] || "there";
    const planDisplay = plan_name === "road_to_8" || plan_name === "elite" ? "Elite" : "Pro";
    const loginUrl = "https://engvolve.com/auth";

    const features = planDisplay === "Elite"
      ? ["Everything in Pro", "Lifetime access — no expiry", "1-on-1 consultation sessions", "Priority support", "All future updates included"]
      : ["Unlimited Reading & Listening practice", "Unlimited Writing with AI feedback", "Unlimited Speaking with AI analysis", "My Journey personalised roadmap", "Full access for 31 days"];

    const featuresHtml = features.map(f =>
      `<tr><td style="padding:5px 0;color:#166534;font-size:14px;">✅ ${f}</td></tr>`
    ).join("");

    await resend.emails.send({
      from: "Engvolve <noreply@engvolve.com>",
      to: [email],
      subject: `Your ${planDisplay} plan is active! 🎉`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="background:linear-gradient(135deg,#0e3860 0%,#1a5c8a 60%,#48A8CC 100%);border-radius:16px 16px 0 0;padding:44px 40px;text-align:center;">
      <p style="color:rgba(255,255,255,0.6);margin:0 0 6px 0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Engvolve</p>
      <h1 style="color:#FFE4A0;margin:0;font-size:32px;font-weight:700;">You're in! 🎉</h1>
      <p style="color:rgba(255,255,255,0.85);margin:10px 0 0 0;font-size:16px;">Your <strong>${planDisplay}</strong> plan is now active</p>
    </div>

    <div style="background:#fff;padding:40px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <p style="color:#1a1a2e;font-size:17px;margin:0 0 16px 0;">Hey ${displayName} 👋</p>

      <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
        Your payment has been confirmed and your <strong>${planDisplay}</strong> subscription is live. You now have full access to everything on Engvolve.
      </p>

      <div style="background:#f0fdf4;border-radius:12px;padding:24px;margin:0 0 28px 0;">
        <p style="color:#166534;font-size:13px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.08em;">What's unlocked for you</p>
        <table style="width:100%;border-collapse:collapse;">
          ${featuresHtml}
        </table>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#0e3860,#48A8CC);color:#FFE4A0;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.02em;">
          Log in to Engvolve →
        </a>
      </div>

      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 8px 0;">
        Start with the <strong>Diagnostic Quiz</strong> if you haven't already — it builds your personalised study roadmap automatically.
      </p>

      <p style="color:#9ca3af;font-size:13px;margin:28px 0 0 0;">
        Any questions? Reply to this email or WhatsApp us — we respond fast.
      </p>
      <p style="color:#1a1a2e;font-size:14px;margin:8px 0 0 0;font-weight:600;">— The Engvolve Team</p>
    </div>

    <div style="text-align:center;padding:24px;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Engvolve. All rights reserved.</p>
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
