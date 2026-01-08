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

const getPlanFeatures = (planName: string): string[] => {
  const planLower = planName.toLowerCase();
  
  if (planLower === 'pro') {
    return [
      "Unlimited Reading practice sessions",
      "Unlimited Listening practice sessions", 
      "Unlimited Writing submissions with AI feedback",
      "Unlimited Speaking practice with analysis",
      "Full access for 31 days"
    ];
  } else if (planLower === 'elite') {
    return [
      "Everything in Pro plan",
      "Lifetime access - no expiration",
      "Priority support",
      "Exclusive consultation sessions",
      "All future feature updates included"
    ];
  }
  
  return ["Access to IELTS practice materials"];
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-verification-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, plan_name }: VerificationEmailRequest = await req.json();
    
    console.log(`Sending verification email to: ${email}, name: ${full_name}, plan: ${plan_name}`);

    if (!email) {
      throw new Error("Email is required");
    }

    const dashboardUrl = "https://ieltsinaja.id/dashboard";
    const displayName = full_name || "IELTS Learner";
    const planDisplayName = plan_name ? plan_name.charAt(0).toUpperCase() + plan_name.slice(1).toLowerCase() : "Premium";
    const features = getPlanFeatures(plan_name || 'pro');

    const featuresHtml = features.map(feature => 
      `<li style="margin-bottom: 8px;">✅ ${feature}</li>`
    ).join('');

    const emailResponse = await resend.emails.send({
      from: "IELTSinAja <ieltsinaja.id@gmail.com>",
      to: [email],
      subject: `Your IELTSinAja account is now ${planDisplayName}! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Congratulations! 🎉</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">You're now a <strong>${planDisplayName}</strong> member!</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
                Hi <strong>${displayName}</strong>,
              </p>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! Your payment has been verified and your <strong>${planDisplayName}</strong> subscription is now active. You now have unlimited access to all the tools you need to achieve Band 8.0!
              </p>
              
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #22c55e; padding: 20px; margin: 24px 0; border-radius: 0 12px 12px 0;">
                <p style="color: #166534; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                  🚀 Your ${planDisplayName} Benefits:
                </p>
                <ul style="color: #166534; margin: 0; padding-left: 0; list-style: none; font-size: 14px; line-height: 1.8;">
                  ${featuresHtml}
                </ul>
              </div>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Let's get that <strong>Band 8.0</strong>! Start practicing now and track your progress towards your IELTS goals.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                  Start Practicing Now →
                </a>
              </div>
              
              <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0; text-align: center;">
                  💡 <strong>Pro Tip:</strong> Consistent daily practice is the key to IELTS success!
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
            
            <div style="text-align: center; padding: 24px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 IELTSinAja. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                This email was sent because your payment was verified on IELTSinAja.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
