import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Sparkles, Crown, Upload, Copy, CheckCircle, Loader2, ArrowLeft, Tag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const getPlans = (hasPromoCode: boolean) => [
  {
    name: "Free",
    price: "IDR 0",
    originalPrice: null,
    period: "",
    description: "Try 1 practice for each feature",
    amount: 0,
    features: [
      "1 Reading practice",
      "1 Listening practice",
      "1 Writing practice",
      "1 Speaking practice",
    ],
    highlighted: false,
    badge: null,
    tier: "free" as const,
    planKey: "free",
  },
  {
    name: "Pro",
    price: hasPromoCode ? "IDR 250K" : "IDR 500K",
    originalPrice: hasPromoCode ? "IDR 500K" : null,
    period: "per month",
    description: "Full access to all features",
    amount: hasPromoCode ? 250000 : 500000,
    features: [
      "Unlimited AI Reading Analysis",
      "Full Listening Lab access",
      "Instant AI Writing Band Scores",
      "Voice-to-Text Speaking Practice",
      "Progress analytics dashboard",
      "Priority support",
    ],
    highlighted: true,
    badge: "Recommended",
    tier: "pro" as const,
    planKey: "pro",
  },
  {
    name: "Human+AI",
    price: "IDR 2.5M",
    originalPrice: null,
    period: "one-time",
    description: "Full access + VIP IELTS alumni coaching",
    amount: 2500000,
    features: [
      "Everything in Pro",
      "5 hours 1-on-1 consultation",
      "Senior Consultant Sessions",
      "Bespoke Study Roadmap",
      "Manual Examiner Essay Reviews",
      "VIP Priority Support",
    ],
    highlighted: false,
    badge: "Limited Spots",
    tier: "elite" as const,
    planKey: "road_to_8",
  },
];

const bankDetails = {
  bankName: "BCA",
  accountNumber: "2302934607",
  accountName: "Bagas Haryo Wicaksono",
};

export default function PricingSelection() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<ReturnType<typeof getPlans>[0] | null>(null);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const plans = getPlans(promoApplied);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "BAGASCUTS") {
      setPromoApplied(true);
      toast.success("Promo code applied! 50% off Pro plan.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleSelectPlan = async (plan: ReturnType<typeof getPlans>[0]) => {
    if (plan.tier === "free") {
      // Update profile to verified and go to dashboard
      if (user) {
        await supabase
          .from("profiles")
          .update({ is_verified: true })
          .eq("user_id", user.id);
        await refreshProfile();
      }
      navigate("/dashboard");
      toast.success("Welcome! You can start practicing now.");
    } else {
      setSelectedPlan(plan);
      setShowBankTransfer(true);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user || !selectedPlan) return;

    const file = event.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("payment_verifications")
        .insert({
          user_id: user.id,
          plan_type: selectedPlan.planKey,
          amount: selectedPlan.amount,
          receipt_url: fileName,
          status: "pending",
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      toast.success("Receipt uploaded! We'll verify your payment within 24 hours.");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload receipt");
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-atmospheric flex items-center justify-center p-6">
        <Card className="glass-card max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="text-2xl font-light mb-4 text-foreground">Payment Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your account will be upgraded within 24 hours after we verify your transfer.
          </p>
          <Button onClick={() => navigate("/waiting-room")} className="w-full">
            Go to Waiting Room
          </Button>
        </Card>
      </div>
    );
  }

  if (showBankTransfer && selectedPlan) {
    return (
      <div className="min-h-screen bg-atmospheric p-6">
        <div className="max-w-lg mx-auto pt-12">
          <Button 
            variant="ghost" 
            onClick={() => setShowBankTransfer(false)} 
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>

          <Card className="glass-card p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-light">Complete Your Purchase</CardTitle>
              <p className="text-muted-foreground mt-2">
                Transfer to the bank account below and upload your receipt
              </p>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              {/* Plan Summary */}
              <div className="bg-secondary/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">{selectedPlan.name}</span>
                  <div className="text-right">
                    <span className="text-accent font-medium">{selectedPlan.price}</span>
                    {selectedPlan.originalPrice && (
                      <span className="text-muted-foreground line-through ml-2 text-sm">
                        {selectedPlan.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Bank Transfer Details</h3>
                
                <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="text-foreground font-medium">{bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono">{bankDetails.accountNumber}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.accountNumber)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedAccount ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name</span>
                    <span className="text-foreground">{bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-accent font-medium">
                      IDR {selectedPlan.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Receipt */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Upload Payment Receipt</h3>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 transition-colors bg-secondary/20">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload receipt
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Image or PDF, max 5MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Your account will be upgraded within 24 hours after we verify your transfer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-atmospheric p-6">
      <div className="max-w-5xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-4 text-foreground">
            Choose Your <span className="text-gradient">Learning Path</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Select the plan that matches your ambition. All plans include AI-powered IELTS practice.
          </p>
          
          {/* Promo Code Section */}
          <div className="max-w-sm mx-auto">
            {!showPromoInput ? (
              <Button
                variant="ghost"
                onClick={() => setShowPromoInput(true)}
                className="text-accent hover:text-accent/80"
              >
                <Tag className="w-4 h-4 mr-2" />
                Have a promo code?
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                  disabled={promoApplied}
                />
                <Button 
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                >
                  {promoApplied ? "Applied!" : "Apply"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Glow effect */}
              {plan.highlighted && (
                <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/50 to-accent/20 rounded-2xl blur-sm -z-10" />
              )}
              {plan.tier === "elite" && (
                <div className="absolute -inset-0.5 bg-gradient-to-b from-elite-gold/50 to-elite-gold/20 rounded-2xl blur-sm -z-10" />
              )}

              <Card
                className={`glass-card h-full flex flex-col ${
                  plan.highlighted
                    ? "border-accent/30"
                    : plan.tier === "elite"
                    ? "border-elite-gold/30"
                    : ""
                }`}
              >
                <CardHeader className="pb-4">
                  {/* Badge */}
                  {plan.badge && (
                    <Badge
                      className={`w-fit mb-4 ${
                        plan.badge === "Recommended"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : "bg-elite-gold/20 text-elite-gold border-elite-gold/30"
                      }`}
                    >
                      {plan.badge === "Recommended" ? (
                        <Sparkles className="w-3 h-3 mr-1" />
                      ) : (
                        <Crown className="w-3 h-3 mr-1" />
                      )}
                      {plan.badge}
                    </Badge>
                  )}

                  <CardTitle className="text-xl font-light">{plan.name}</CardTitle>

                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-light text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    )}
                  </div>
                  {plan.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through mt-1">
                      {plan.originalPrice}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    variant={plan.highlighted ? "default" : "outline"}
                    className={`w-full ${
                      plan.tier === "elite"
                        ? "border-elite-gold/30 text-elite-gold hover:bg-elite-gold/10"
                        : plan.tier === "free"
                        ? "border-muted-foreground/30"
                        : ""
                    }`}
                  >
                    {plan.tier === "free" ? "Continue with Free Plan" : "Sign me Up!"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
