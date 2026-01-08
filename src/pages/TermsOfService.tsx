import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <h1 className="text-4xl font-light mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 8, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-foreground/80 leading-relaxed">
              By accessing and using IELTSinAja, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform. We reserve the right to 
              modify these terms at any time, with changes effective upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">2. Description of Service</h2>
            <p className="text-foreground/80 leading-relaxed">
              IELTSinAja is an AI-powered IELTS preparation platform offering practice tests, instant feedback, 
              and personalized learning tools for Reading, Listening, Writing, and Speaking modules. Our 
              premium plans include access to human consultants for personalized coaching.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">3. User Accounts</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">When creating an account, you agree to:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">4. Subscription Plans</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We offer the following subscription tiers:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Free Plan:</strong> Limited to 1 practice per module for trial purposes.</li>
              <li><strong>Pro Plan:</strong> Full access to all AI-powered features for 2 months.</li>
              <li><strong>Human+AI Plan:</strong> Pro features plus 5 hours of 1-on-1 consultation with senior consultants.</li>
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Payments are processed via bank transfer. Account upgrades occur within 24 hours of payment verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">5. Refund Policy</h2>
            <p className="text-foreground/80 leading-relaxed">
              Refund requests must be submitted within 7 days of purchase and before using more than 20% of 
              the service features. Consultation hours that have been used are non-refundable. Refunds are 
              processed within 14 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">6. Acceptable Use</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Copy, redistribute, or sell our practice materials</li>
              <li>Use automated tools to access or scrape the platform</li>
              <li>Share AI-generated feedback for commercial purposes</li>
              <li>Submit content that violates intellectual property rights</li>
              <li>Attempt to circumvent subscription restrictions</li>
              <li>Use the platform for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">7. Intellectual Property</h2>
            <p className="text-foreground/80 leading-relaxed">
              All content on IELTSinAja, including practice materials, AI models, and branding, is owned by 
              IELTSinAja or its licensors. You retain ownership of your submitted essays and recordings, 
              but grant us a license to process them for service delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">8. Disclaimer of Warranties</h2>
            <p className="text-foreground/80 leading-relaxed">
              IELTSinAja is provided "as is" without warranties of any kind. While we strive for accuracy in 
              our AI scoring, we do not guarantee that scores will match official IELTS results. Our platform 
              is a preparation tool and not a substitute for official testing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">9. Limitation of Liability</h2>
            <p className="text-foreground/80 leading-relaxed">
              To the maximum extent permitted by law, IELTSinAja shall not be liable for any indirect, 
              incidental, or consequential damages arising from your use of the platform. Our total liability 
              shall not exceed the amount you paid for the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">10. Governing Law</h2>
            <p className="text-foreground/80 leading-relaxed">
              These terms are governed by the laws of the Republic of Indonesia. Any disputes shall be 
              resolved through arbitration in Jakarta, Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">11. Contact</h2>
            <p className="text-foreground/80 leading-relaxed">
              For questions about these Terms of Service, please contact us via WhatsApp at +62 819-3434-9453.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
