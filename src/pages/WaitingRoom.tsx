import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Mail, LogOut } from "lucide-react";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading, refreshProfile } = useAuth();

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate("/auth");
      return;
    }

    // Super admin bypasses waiting room
    if (isAdmin) {
      navigate("/dashboard");
      return;
    }

    // Redirect to dashboard if verified
    if (profile?.is_verified) {
      navigate("/dashboard");
    }
  }, [user, profile, isLoading, navigate]);

  // Poll for verification status every 30 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      refreshProfile();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, refreshProfile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-elite-gold/5 rounded-full blur-3xl" />
      </div>

      <Card className="glass-card max-w-lg w-full relative z-10">
        <CardContent className="p-10 text-center space-y-8">
          {/* Animated Clock Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-background/80 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-accent" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-light text-foreground">
              Verification in Progress
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for your payment! Our team of examiners is currently
              verifying your transfer. You will gain full access to your
              dashboard within <span className="text-accent font-medium">24 hours</span>.
            </p>
          </div>

          <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>We'll notify you at <span className="text-foreground">{user?.email}</span></span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              This page will automatically refresh once your account is verified.
            </p>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
