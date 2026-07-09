import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Phone, AlertCircle } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const phoneSchema = z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number is too long")
  .regex(/^(\+62|62|0)?8[1-9][0-9]{7,11}$/, "Please enter a valid Indonesian phone number");

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const planParam = searchParams.get("plan");
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const pricingDest = planParam ? `/pricing-selection?plan=${planParam}` : "/pricing-selection";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback${planParam ? `?plan=${planParam}` : ""}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
      setGoogleLoading(false);
    }
    // On success the browser redirects — no need to setGoogleLoading(false)
  };

  // Resolve where to send the user after login — checks admin role and profile
  const resolveDestination = async (userId: string): Promise<string | null> => {
    const { data: isAdminRole } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });
    if (isAdminRole) return "/dashboard";

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Something went wrong",
        description: "Could not load your account. Please try again.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return null;
    }

    if (!profile) {
      await supabase.auth.signOut();
      setAuthError("No account found for this email. Please sign up first.");
      return null;
    }

    // Unverified users (chose paid plan, awaiting admin approval) → waiting room
    if (!profile.is_verified) return "/waiting-room";

    return "/dashboard";
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; phone?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      const phoneResult = phoneSchema.safeParse(phoneNumber);
      if (!phoneResult.success) {
        newErrors.phone = phoneResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    setAuthError(null);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const dest = await resolveDestination(data.user.id);
        if (dest) navigate(dest);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${pricingDest}`,
            data: { full_name: fullName, phone_number: phoneNumber },
          },
        });

        if (error) throw error;

        const needsEmailConfirmation =
          data.user && !data.user.email_confirmed_at && data.user.identities?.length === 1;

        if (needsEmailConfirmation) {
          toast({ title: "Check your email!", description: "We sent you a 6-digit verification code." });
          navigate(`/verify-email?email=${encodeURIComponent(email)}${planParam ? `&plan=${planParam}` : ""}`);
        } else if (planParam === "free") {
          toast({ title: "Account created!", description: "Welcome! Taking you to your dashboard." });
          navigate("/dashboard");
        } else {
          toast({ title: "Account created!", description: "Setting up your plan..." });
          navigate(pricingDest);
        }
      }
    } catch (error: any) {
      let message = error.message;
      if (error.message?.includes("Invalid login credentials")) {
        message = "Incorrect email or password. Please try again.";
      } else if (error.message?.includes("already registered")) {
        message = "This email is already registered. Please login instead.";
      }
      setAuthError(message);
    } finally {
      setIsLoading(false);
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
          onClick={() => navigate("/")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-tight">
              Eng<span className="text-accent font-medium">volve</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground/80">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-secondary/50 border-border/50"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-foreground/80">Phone Number (Indonesia)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      className={`pl-10 bg-secondary/50 border-border/50 ${errors.phone ? "border-destructive" : ""}`}
                      placeholder="08123456789"
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      We use this for WhatsApp support and to confirm your payment.
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`pl-10 bg-secondary/50 border-border/50 ${errors.email ? "border-destructive" : ""}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`pl-10 pr-10 bg-secondary/50 border-border/50 ${errors.password ? "border-destructive" : ""}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {authError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{authError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="neumorphicPrimary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </Button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2.5"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </Button>

            {!isLogin && (
              <p className="text-[11px] text-muted-foreground text-center">
                By creating an account you agree to our{" "}
                <Link to="/terms-of-service" className="text-accent hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setAuthError(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
