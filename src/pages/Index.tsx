import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofBar } from "@/components/SocialProofBar";
import { FeatureGrid } from "@/components/FeatureGrid";
import { MissionBridge } from "@/components/MissionBridge";
import { PricingMatrix } from "@/components/PricingMatrix";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <SocialProofBar />
        <FeatureGrid />
        <MissionBridge />
        <PricingMatrix />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
