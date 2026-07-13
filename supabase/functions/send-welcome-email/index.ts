import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, full_name }: { email: string; full_name?: string } = await req.json();
    if (!email) throw new Error("Email is required");

    const name = full_name?.split(" ")[0] || "there";

    await resend.emails.send({
      from: "Engvolve <noreply@engvolve.com>",
      to: [email],
      subject: "Welcome to Engvolve — let's get that band score 🎯",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0e3860 0%,#1a5c8a 60%,#48A8CC 100%);border-radius:16px 16px 0 0;padding:44px 40px;text-align:center;">
      <p style="color:rgba(255,255,255,0.6);margin:0 0 6px 0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">Welcome to</p>
      <h1 style="color:#FFE4A0;margin:0;font-size:36px;font-weight:700;letter-spacing:-0.5px;">Engvolve</h1>
      <p style="color:rgba(255,255,255,0.75);margin:12px 0 0 0;font-size:15px;line-height:1.5;">Indonesia's all-in-one IELTS prep platform</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <p style="color:#1a1a2e;font-size:17px;margin:0 0 16px 0;">Hey ${name} 👋</p>

      <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
        You've just joined a growing community of Indonesian students who are serious about hitting their target band score. We're genuinely glad you're here.
      </p>

      <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
        Engvolve was built by <strong style="color:#1a1a2e;">8.5+ scorers</strong> who've been through the exact same process — and we've put everything we know into the platform you're about to use.
      </p>

      <!-- What's waiting -->
      <div style="background:#f0f7ff;border-radius:12px;padding:24px;margin:0 0 28px 0;">
        <p style="color:#0e3860;font-size:14px;font-weight:700;margin:0 0 14px 0;text-transform:uppercase;letter-spacing:0.08em;">Here's what's waiting for you</p>
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ["📖", "Reading", "Timed practice with instant scoring"],
            ["🎧", "Listening", "Real exam audio with question types"],
            ["✍️", "Writing", "AI feedback on Task 1 & Task 2"],
            ["🎤", "Speaking", "Part 1, 2 & 3 with AI analysis"],
            ["🗺️", "My Journey", "Your personalised week-by-week roadmap"],
          ].map(([icon, label, desc]) => `
          <tr>
            <td style="padding:6px 10px 6px 0;font-size:18px;vertical-align:top;">${icon}</td>
            <td style="padding:6px 0;vertical-align:top;">
              <strong style="color:#1a1a2e;font-size:14px;">${label}</strong>
              <p style="color:#6b7280;font-size:13px;margin:2px 0 0 0;">${desc}</p>
            </td>
          </tr>`).join("")}
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://engvolve.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#0e3860,#48A8CC);color:#FFE4A0;text-decoration:none;padding:16px 40px;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.02em;">
          Go to my dashboard →
        </a>
      </div>

      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 8px 0;">
        Start with the <strong style="color:#1a1a2e;">Diagnostic Quiz</strong> — it takes 10 minutes and builds your personalised roadmap automatically.
      </p>

      <p style="color:#9ca3af;font-size:13px;margin:28px 0 0 0;">
        Questions? Just reply to this email or reach us on WhatsApp. We respond fast.
      </p>
      <p style="color:#1a1a2e;font-size:14px;margin:8px 0 0 0;font-weight:600;">— The Engvolve Team</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Engvolve. All rights reserved.</p>
      <p style="color:#9ca3af;font-size:12px;margin:6px 0 0 0;">You're receiving this because you created an account at engvolve.com.</p>
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
