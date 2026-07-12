import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sun, Moon, User, Bell, BookOpen, Crown, LogOut,
  Shield, Palette, Target, Camera, AlertTriangle,
  Check, Loader2, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { profile, user, signOut, isAdmin, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [emailNotifs, setEmailNotifs] = useState(() => {
    try { return localStorage.getItem("ielts-email-notifs") !== "false"; } catch { return true; }
  });
  const [studyReminders, setStudyReminders] = useState(() => {
    try { return localStorage.getItem("ielts-study-reminders") === "true"; } catch { return false; }
  });
  const [targetBand, setTargetBand] = useState(() => {
    try { return localStorage.getItem("ielts-target-band") || "7.0"; } catch { return "7.0"; }
  });

  // Profile editing state
  const [displayName, setDisplayName] = useState(profile?.full_name ?? "");
  const [nameStatus, setNameStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showNameWarning, setShowNameWarning] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const userTier = profile?.subscription_tier || "free";
  const alreadyChangedName = profile?.username_changed ?? false;

  const getInitials = (name?: string | null) =>
    name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: `${publicUrl}?t=${Date.now()}` })
        .eq("user_id", user.id);
      if (updateError) throw updateError;
      await refreshProfile();
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    if (!alreadyChangedName && !showNameWarning) {
      setShowNameWarning(true);
      return;
    }
    setShowNameWarning(false);
    setNameStatus("saving");
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: displayName.trim(), username_changed: true })
      .eq("user_id", user.id);
    if (error) {
      setNameStatus("error");
    } else {
      setNameStatus("saved");
      await refreshProfile();
      setTimeout(() => setNameStatus("idle"), 2000);
    }
  };

  const handleEmailNotifs = (val: boolean) => {
    setEmailNotifs(val);
    try { localStorage.setItem("ielts-email-notifs", String(val)); } catch {}
  };

  const handleStudyReminders = (val: boolean) => {
    setStudyReminders(val);
    try { localStorage.setItem("ielts-study-reminders", String(val)); } catch {}
  };

  const handleTargetBand = (val: string) => {
    setTargetBand(val);
    try { localStorage.setItem("ielts-target-band", val); } catch {}
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const tierColors: Record<string, string> = {
    free: "text-muted-foreground",
    pro: "text-accent",
    elite: "text-elite-gold",
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-light">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* ── Profile ─────────────────────────────────────── */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-accent/20 text-accent text-2xl font-semibold">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shadow-md hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {avatarUploading
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Camera className="w-3.5 h-3.5" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{profile?.full_name || "User"}</p>
                <p className="text-sm text-muted-foreground truncate">{profile?.email || user?.email || "—"}</p>
                <span className={cn("text-xs font-medium capitalize flex items-center gap-1 mt-1", tierColors[userTier])}>
                  {userTier === "elite" && <Crown className="w-3 h-3" />}
                  {userTier} plan
                </span>
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <Input
                value={profile?.email || user?.email || ""}
                readOnly
                className="bg-secondary/40 text-muted-foreground cursor-default focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Display name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Display Name</Label>
                {alreadyChangedName && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                    <Lock className="w-2.5 h-2.5" /> One-time change used
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={displayName}
                  onChange={e => { setDisplayName(e.target.value); setShowNameWarning(false); setNameStatus("idle"); }}
                  placeholder="Your display name"
                  disabled={alreadyChangedName}
                  className={cn(alreadyChangedName && "opacity-50 cursor-not-allowed")}
                />
                {!alreadyChangedName && (
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    disabled={!displayName.trim() || displayName.trim() === profile?.full_name || nameStatus === "saving"}
                    className="shrink-0 gap-1.5 px-4"
                  >
                    {nameStatus === "saving" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {nameStatus === "saved" && <Check className="w-3.5 h-3.5" />}
                    {nameStatus === "saved" ? "Saved" : "Save"}
                  </Button>
                )}
              </div>
              {/* One-time warning */}
              {showNameWarning && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-600">You can only change your display name once.</p>
                    <p className="text-xs text-amber-500/80 mt-0.5">After saving, this cannot be changed again.</p>
                    <div className="flex gap-2 mt-2.5">
                      <Button size="sm" onClick={handleSaveName} className="h-7 px-3 text-xs">
                        Confirm change
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowNameWarning(false); setDisplayName(profile?.full_name ?? ""); }} className="h-7 px-3 text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {nameStatus === "error" && (
                <p className="text-xs text-destructive">Failed to save. Please try again.</p>
              )}
              {alreadyChangedName && (
                <p className="text-xs text-muted-foreground">Display name can only be changed once. Contact support if you need help.</p>
              )}
            </div>

            {/* Plan + member since */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-0.5">Plan</p>
                <p className={cn("text-sm font-medium capitalize flex items-center gap-1.5", tierColors[userTier])}>
                  {userTier === "elite" && <Crown className="w-3.5 h-3.5" />}
                  {userTier}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-0.5">Member since</p>
                <p className="text-sm font-medium text-foreground">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>

            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin")}
                className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ── Appearance ─────────────────────────────────── */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Choose the look that works best for you</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                  theme === "dark" ? "border-accent bg-accent/10" : "border-border/50 hover:border-border"
                )}
              >
                <div className="w-full h-16 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="w-6 h-10 rounded bg-slate-800 border border-slate-600" />
                  <div className="flex-1 space-y-1.5 pr-2">
                    <div className="h-2 rounded-full bg-slate-700 w-full" />
                    <div className="h-2 rounded-full bg-slate-700 w-3/4" />
                    <div className="h-2 rounded-full bg-sky-400/60 w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  <span className="text-sm font-medium">Dark</span>
                </div>
                {theme === "dark" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                  theme === "light" ? "border-accent bg-accent/10" : "border-border/50 hover:border-border"
                )}
              >
                <div className="w-full h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="w-6 h-10 rounded bg-slate-100 border border-slate-200" />
                  <div className="flex-1 space-y-1.5 pr-2">
                    <div className="h-2 rounded-full bg-slate-200 w-full" />
                    <div className="h-2 rounded-full bg-slate-200 w-3/4" />
                    <div className="h-2 rounded-full bg-sky-500/50 w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span className="text-sm font-medium">Light</span>
                </div>
                {theme === "light" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ── Study Preferences ─────────────────────────── */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Study Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Target Band Score</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Your goal for the IELTS exam</p>
              </div>
              <Select value={targetBand} onValueChange={handleTargetBand}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Study Reminders</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Daily practice nudges</p>
              </div>
              <Switch checked={studyReminders} onCheckedChange={handleStudyReminders} />
            </div>
          </CardContent>
        </Card>

        {/* ── Notifications ─────────────────────────────── */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Progress updates and tips</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={handleEmailNotifs} />
            </div>
          </CardContent>
        </Card>

        {/* ── Subscription ──────────────────────────────── */}
        {userTier !== "elite" && (
          <Card className="glass-card border-elite-gold/20 bg-elite-gold/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Crown className="w-4 h-4 text-elite-gold" />
                <span className="text-elite-gold">Upgrade your plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {userTier === "free"
                  ? "Unlock Writing, Speaking, and all practice modules."
                  : "Unlock 1-on-1 consultations and elite study materials."}
              </p>
              <Button
                onClick={() => navigate("/#pricing")}
                className="w-full bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
                variant="outline"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Sign Out ──────────────────────────────────── */}
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
