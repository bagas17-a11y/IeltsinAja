import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-light mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 8, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">1. Introduction</h2>
            <p className="text-foreground/80 leading-relaxed">
              Welcome to IELTSinAja. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our 
              IELTS preparation platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">2. Information We Collect</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li><strong>Personal Information:</strong> Name, email address, and payment information when you register or subscribe.</li>
              <li><strong>Usage Data:</strong> Practice test results, progress tracking, and learning analytics.</li>
              <li><strong>Audio Recordings:</strong> Voice recordings during speaking practice sessions (stored securely and used only for analysis).</li>
              <li><strong>Written Content:</strong> Essays and written responses submitted for AI analysis.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">3. How We Use Your Information</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">Your information is used to:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Provide personalized IELTS preparation services</li>
              <li>Generate AI-powered feedback on your practice tests</li>
              <li>Track your learning progress and provide recommendations</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates about your account and our services</li>
              <li>Improve our platform through anonymized analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">4. Data Security</h2>
            <p className="text-foreground/80 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption in transit 
              and at rest, secure authentication, and regular security audits. Your practice data is stored on secure 
              servers with restricted access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">5. Data Sharing</h2>
            <p className="text-foreground/80 leading-relaxed">
              We do not sell your personal information. We may share data with trusted service providers who assist 
              in operating our platform (payment processors, cloud hosting), but only under strict confidentiality 
              agreements. We may also disclose information if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">6. Your Rights</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-foreground/80 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Export your practice history and progress data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">7. Cookies</h2>
            <p className="text-foreground/80 leading-relaxed">
              We use essential cookies to maintain your session and preferences. Analytics cookies help us understand 
              how users interact with our platform. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-foreground">8. Contact Us</h2>
            <p className="text-foreground/80 leading-relaxed">
              For privacy-related inquiries, please contact us via WhatsApp at +62 819-3434-9453 or through our 
              contact page. We aim to respond to all requests within 48 hours.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
