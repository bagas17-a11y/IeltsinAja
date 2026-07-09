import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Headphones, PenTool, Mic,
  BarChart3, Settings, LogOut, GraduationCap, Shield,
  Crown, Target, Map, Layers, FlipHorizontal, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav data ────────────────────────────────────────────────────────────────

const GROUPS = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard",     path: "/dashboard",            icon: LayoutDashboard },
      { title: "Diagnostic",    path: "/dashboard/diagnostic", icon: Target },
      { title: "Study Plan",    path: "/dashboard/study-plan", icon: Map },
      { title: "Progress Stats",path: "/dashboard/stats",      icon: BarChart3 },
      { title: "Settings",      path: "/dashboard/settings",   icon: Settings },
    ],
  },
  {
    label: "Practice",
    items: [
      { title: "Reading",  path: "/dashboard/reading",  icon: BookOpen },
      { title: "Listening",path: "/dashboard/listening",icon: Headphones },
      { title: "Writing",  path: "/dashboard/writing",  icon: PenTool },
      { title: "Speaking", path: "/dashboard/speaking", icon: Mic },
    ],
  },
  {
    label: "Pro",
    items: [
      { title: "Revision Notes", path: "/dashboard/revision-notes", icon: Layers },
      { title: "Flashcards",     path: "/dashboard/flashcards",     icon: FlipHorizontal },
      { title: "Study Groups",   path: "/dashboard/group",          icon: Users },
    ],
  },
  {
    label: "Elite",
    items: [
      { title: "Elite Hub", path: "/dashboard/elite", icon: Crown },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut, isAdmin } = useAuth();

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <aside
      className={cn(
        // Positioning — sits in normal flow on desktop (no fixed/absolute)
        "hidden md:flex flex-col shrink-0",
        "h-screen sticky top-0",
        // Default collapsed width; expands to w-52 on hover
        "w-14 hover:w-52 transition-[width] duration-200 ease-out",
        "border-r border-border/30 bg-background overflow-hidden z-30",
        "group/sidebar",
      )}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="h-12 flex items-center gap-3 px-3.5 border-b border-border/30 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-accent" />
        </div>
        <div className="overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 whitespace-nowrap">
          <p className="text-sm font-semibold leading-none">Engvolve</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Study Dashboard</p>
        </div>
      </div>

      {/* ── Nav groups ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1">
        {GROUPS.map(group => (
          <div key={group.label}>
            {/* Group label — hidden when collapsed, fades in on hover */}
            <p className="px-3.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
              {group.label}
            </p>
            {group.items.map(item => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2 text-sm transition-colors",
                    active
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                >
                  <item.icon className={cn("w-4 h-4 shrink-0", active && "text-accent")} />
                  <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 text-left">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Admin */}
        {isAdmin && (
          <div>
            <p className="px-3.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
              Admin
            </p>
            <button
              onClick={() => navigate("/admin")}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2 text-sm transition-colors",
                location.pathname.startsWith("/admin")
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 text-left">
                Admin Portal
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="border-t border-border/30 p-3 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-accent/20 text-accent text-[10px]">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
            <p className="text-xs font-medium truncate whitespace-nowrap">{profile?.full_name || "User"}</p>
            <Badge variant="outline" className="text-[9px] capitalize h-4 px-1 mt-0.5">
              {profile?.subscription_tier || "free"}
            </Badge>
          </div>
          <button
            onClick={handleSignOut}
            className="shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-foreground p-1 rounded"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
