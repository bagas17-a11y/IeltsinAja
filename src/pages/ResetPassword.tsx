import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase puts the recovery token in the URL hash; onAuthStateChange fires PASSWORD_RECOVERY
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      setTimeout(() => navigate("/auth"), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-atmospheric flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-glow-accent/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img src="/logo.svg" alt="Engvolve" className="w-9 h-9" />
              <h1 className="text-2xl font-light tracking-tight">
                Eng<span className="text-accent font-medium">volve</span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Set a new password</p>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
              <p className="text-base font-medium text-foreground">Password updated!</p>
              <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
            </div>
          ) : !sessionReady ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Verifying your reset link...</p>
              <p className="text-xs text-muted-foreground/60">Make sure you opened the link directly from the email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="pl-10 pr-10 bg-secondary/50 border-border/50"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPass ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className="pl-10 bg-secondary/50 border-border/50"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" variant="neumorphicPrimary" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
