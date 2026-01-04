import { useLocation, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Users, 
  LayoutDashboard,
  LogOut,
  Crown,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard", tier: "free" },
  { icon: BookOpen, label: "Reading", path: "/dashboard/reading", tier: "free" },
  { icon: Headphones, label: "Listening", path: "/dashboard/listening", tier: "free" },
  { icon: PenTool, label: "Writing", path: "/dashboard/writing", tier: "pro" },
  { icon: Mic, label: "Speaking", path: "/dashboard/speaking", tier: "pro" },
  { icon: Users, label: "Consultation", path: "/dashboard/consultation", tier: "elite" },
];

const tierOrder = { free: 0, pro: 1, elite: 2 };

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const userTier = profile?.subscription_tier || "free";

  const canAccess = (requiredTier: string) => {
    return tierOrder[userTier as keyof typeof tierOrder] >= tierOrder[requiredTier as keyof typeof tierOrder];
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (canAccess(item.tier)) {
      navigate(item.path);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-card border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <a href="/" className="text-xl font-light tracking-tight text-foreground">
          IELTS<span className="text-accent font-medium">inAja</span>
        </a>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-medium text-sm">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || "User"}
            </p>
            <div className="flex items-center gap-1.5">
              {userTier === "elite" && <Crown className="w-3 h-3 text-elite-gold" />}
              <span className={cn(
                "text-xs capitalize",
                userTier === "elite" ? "text-elite-gold" : "text-muted-foreground"
              )}>
                {userTier} Plan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const hasAccess = canAccess(item.tier);

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              disabled={!hasAccess}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300",
                isActive
                  ? "bg-accent/20 text-accent"
                  : hasAccess
                  ? "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
                  : "text-muted-foreground/50 cursor-not-allowed"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {!hasAccess && <Lock className="w-4 h-4" />}
              {item.tier === "elite" && hasAccess && (
                <Crown className="w-4 h-4 text-elite-gold" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade CTA for non-elite users */}
      {userTier !== "elite" && (
        <div className="p-4 border-t border-border/30">
          <div className="glass-card p-4 bg-elite-gold/5 border-elite-gold/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-elite-gold" />
              <span className="text-sm font-medium text-elite-gold">Upgrade</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock all modules and 1-on-1 consultations
            </p>
            <button
              onClick={() => navigate("/#pricing")}
              className="w-full py-2 px-4 rounded-lg bg-elite-gold/20 text-elite-gold text-sm font-medium hover:bg-elite-gold/30 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="p-4 border-t border-border/30">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
