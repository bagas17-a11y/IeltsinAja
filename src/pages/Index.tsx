import { useLayoutEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofBar } from "@/components/SocialProofBar";
import { FeatureGrid } from "@/components/FeatureGrid";
import { MissionBridge } from "@/components/MissionBridge";
import { PricingMatrix } from "@/components/PricingMatrix";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CredibilitySection } from "@/components/CredibilitySection";

const Index = () => {
  // Landing page is always light — bright Cluely-style feel regardless of saved preference.
  // MutationObserver prevents ThemeProvider from removing .light while this page is mounted.
  // Cleanup restores the user's dashboard theme on navigation away.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("light");

    const observer = new MutationObserver(() => {
      if (!root.classList.contains("light")) root.classList.add("light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      const stored = localStorage.getItem("ielts-theme");
      if (!stored || stored === "dark") root.classList.remove("light");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <CredibilitySection />
        <SocialProofBar />
        <FeatureGrid />
        <MissionBridge />
        <PricingMatrix />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
