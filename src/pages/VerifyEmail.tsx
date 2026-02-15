import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit code from your email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email!,
        token: code,
        type: 'email',
      });

      if (error) throw error;

      toast({
        title: "Email verified!",
        description: "Your account is now active.",
      });

      // Redirect to pricing selection for new users
      navigate("/pricing-selection");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email!,
      });

      if (error) throw error;

      toast({
        title: "Code resent!",
        description: "Check your email for a new verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-atmospheric flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-glow-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-elite-gold/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-tight">
              IELTS<span className="text-accent font-medium">inAja</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Verify your email
            </p>
          </div>

          {/* Email info */}
          <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">Code sent to:</span>
            </div>
            <p className="text-foreground font-medium mt-1">{email}</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-foreground/80">
                Enter 6-digit code
              </label>
              <Input
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                }}
                className="text-center text-2xl tracking-widest bg-secondary/50 border-border/50"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Check your email for the verification code
              </p>
            </div>

            <Button
              type="submit"
              variant="neumorphicPrimary"
              className="w-full"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Didn't receive a code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
