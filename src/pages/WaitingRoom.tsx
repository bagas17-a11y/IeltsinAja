import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Mail, LogOut, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, CONTACT_MESSAGES } from "@/lib/contact";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading, refreshProfile, isAdmin } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Not logged in → back to auth
    if (!user) {
      navigate("/auth");
      return;
    }

    // Admin bypasses waiting room
    if (isAdmin) {
      navigate("/dashboard");
      return;
    }

    // Verified → go to dashboard
    if (profile?.is_verified) {
      navigate("/dashboard");
      return;
    }

    // If profile is still null here, the DB trigger hasn't resolved yet.
    // Stay on this page — the 30-second poll will load it.
  }, [user, profile, isLoading, navigate, isAdmin]);

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
    navigate("/auth");
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
              Waiting for activation
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Your account will be approved immediately once you have completed payment via WhatsApp and an admin confirms it.
              You can still use Free practice on the{" "}
              <button
                type="button"
                className="text-accent underline"
                onClick={() => navigate("/dashboard")}
              >
                dashboard
              </button>{" "}
              while you wait — usually within a few hours during Jakarta business hours.
            </p>
          </div>

          <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>
                We'll email you at <span className="text-foreground">{user?.email}</span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              This page refreshes automatically once your account unlocks.
            </p>

            <a
              href={buildWhatsAppLink(CONTACT_MESSAGES.statusCheck)}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Check my package status
              </Button>
            </a>

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
