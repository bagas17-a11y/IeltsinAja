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
  // Landing page is always dark — the hero uses a night-sky aesthetic.
  // MutationObserver prevents ThemeProvider from re-adding .light while mounted.
  // Cleanup restores the user's saved theme on navigation away.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");

    const observer = new MutationObserver(() => {
      if (root.classList.contains("light")) root.classList.remove("light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      const stored = localStorage.getItem("ielts-theme");
      if (!stored || stored === "light") root.classList.add("light");
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
