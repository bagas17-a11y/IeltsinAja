import { useState } from "react";
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
  Lock,
  Shield,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut, user } = useAuth();
  const userTier = profile?.subscription_tier || "free";
  // isAdmin comes from useAuth hook

  const canAccess = (requiredTier: string) => {
    if (isAdmin) return true;
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

  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const hasAccess = canAccess(item.tier);

    const button = (
      <button
        onClick={() => handleNavClick(item)}
        disabled={!hasAccess}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300",
          isCollapsed && "justify-center px-2",
          isActive
            ? "bg-accent/20 text-accent"
            : hasAccess
            ? "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
            : "text-muted-foreground/50 cursor-not-allowed"
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {!hasAccess && <Lock className="w-4 h-4" />}
            {item.tier === "elite" && hasAccess && (
              <Crown className="w-4 h-4 text-elite-gold" />
            )}
          </>
        )}
      </button>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {!hasAccess && <Lock className="w-3 h-3" />}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "h-screen fixed left-0 top-0 glass-card border-r border-border/50 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-background border border-border shadow-sm hover:bg-secondary"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>

        {/* Logo */}
        <div className={cn(
          "p-6 border-b border-border/30",
          isCollapsed && "p-4 flex justify-center"
        )}>
          <a href="/" className={cn(
            "text-xl font-light tracking-tight text-foreground",
            isCollapsed && "text-lg"
          )}>
            {isCollapsed ? (
              <span className="text-accent font-medium">IA</span>
            ) : (
              <>IELTS<span className="text-accent font-medium">inAja</span></>
            )}
          </a>
        </div>

        {/* User info */}
        <div className={cn(
          "p-4 border-b border-border/30",
          isCollapsed && "flex justify-center"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center cursor-default">
                  <span className="text-accent font-medium text-sm">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{userTier} Plan</p>
              </TooltipContent>
            </Tooltip>
          ) : (
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
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}

          {/* Admin Portal Link - Only for Super Admin */}
          {isAdmin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/admin")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 mt-4 border border-destructive/30",
                    isCollapsed && "justify-center px-2",
                    location.pathname === "/admin"
                      ? "bg-destructive/20 text-destructive"
                      : "text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="flex-1 text-left">Admin Portal</span>}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Admin Portal</TooltipContent>
              )}
            </Tooltip>
          )}
        </nav>

        {/* Upgrade CTA for non-elite users */}
        {userTier !== "elite" && !isCollapsed && (
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

        {/* Upgrade icon when collapsed */}
        {userTier !== "elite" && isCollapsed && (
          <div className="p-2 border-t border-border/30 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/#pricing")}
                  className="p-2 rounded-lg bg-elite-gold/10 text-elite-gold hover:bg-elite-gold/20 transition-colors"
                >
                  <Crown className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Upgrade to Elite</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Sign out */}
        <div className={cn(
          "p-4 border-t border-border/30",
          isCollapsed && "flex justify-center p-2"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-300",
                  isCollapsed ? "w-10 h-10 justify-center p-0" : "w-full"
                )}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>Sign Out</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Sign Out</TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}