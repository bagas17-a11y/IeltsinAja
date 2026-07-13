import { useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofBar } from "@/components/SocialProofBar";
import { PricingMatrix } from "@/components/PricingMatrix";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CredibilitySection } from "@/components/CredibilitySection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);
  // Landing page is always light — daytime ocean background needs light theme for nav/sections.
  // MutationObserver prevents ThemeProvider from removing .light while mounted.
  // Cleanup restores the user's saved dashboard theme on navigation away.
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
        <HowItWorksSection />
        <CredibilitySection />
        <SocialProofBar />
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
