import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Building2, Copy, Check, ArrowLeft, Loader2 } from "lucide-react";

const bankAccounts = [
  {
    bank: "BCA",
    accountNumber: "1234567890",
    accountName: "PT IELTS Prep Indonesia",
    logo: "🏦",
  },
  {
    bank: "Mandiri",
    accountNumber: "0987654321",
    accountName: "PT IELTS Prep Indonesia",
    logo: "🏛️",
  },
  {
    bank: "CIMB Niaga",
    accountNumber: "5678901234",
    accountName: "PT IELTS Prep Indonesia",
    logo: "💳",
  },
];

const plans = {
  pro: { name: "Pro", price: "IDR 300,000", amount: 300000 },
  road_to_8: { name: "Road to 8.0+", price: "IDR 2,500,000", amount: 2500000 },
};

export default function BankTransfer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const planType = searchParams.get("plan") as "pro" | "road_to_8";
  const plan = plans[planType] || plans.pro;

  const copyToClipboard = (text: string, bankName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(bankName);
    toast.success("Account number copied!");
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file");
      return;
    }

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

      const { data: urlData } = supabase.storage
        .from("payment-receipts")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("payment_verifications")
        .insert({
          user_id: user.id,
          plan_type: planType,
          amount: plan.amount,
          receipt_url: fileName,
          status: "pending",
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      toast.success("Receipt uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload receipt");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Please log in to continue with your purchase.</p>
            <Button onClick={() => navigate("/auth")} variant="neumorphicPrimary">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-light text-foreground">Thank You!</h2>
            <p className="text-muted-foreground">
              Your payment proof has been submitted. Our team will verify your transfer within 24 hours.
              You'll receive access to your {plan.name} plan once verified.
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="glass">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Button>

        {/* Plan Summary */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-light">Complete Your Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{plan.name} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {planType === "pro" ? "Monthly subscription" : "One-time payment"}
                </p>
              </div>
              <p className="text-2xl font-light text-foreground">{plan.price}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-light flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Transfer to One of These Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bankAccounts.map((bank) => (
              <div
                key={bank.bank}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{bank.logo}</span>
                  <div>
                    <p className="font-medium text-foreground">{bank.bank}</p>
                    <p className="text-sm text-muted-foreground">{bank.accountName}</p>
                    <p className="font-mono text-foreground">{bank.accountNumber}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bank.accountNumber, bank.bank)}
                >
                  {copiedAccount === bank.bank ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-light flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Proof of Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="block">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <p className="text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-foreground mb-2">Click to upload receipt</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, or PDF (max 5MB)
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}