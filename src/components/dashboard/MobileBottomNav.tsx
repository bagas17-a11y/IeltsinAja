import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen, Headphones, PenTool, Mic, LayoutDashboard,
  Map, BarChart3, Settings, Target, Layers, FlipHorizontal,
  Users, Crown, Shield, MoreHorizontal, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PRIMARY = [
  { label: "Home",      path: "/dashboard",           icon: LayoutDashboard, exact: true },
  { label: "Reading",   path: "/dashboard/reading",   icon: BookOpen,        exact: false },
  { label: "Listening", path: "/dashboard/listening", icon: Headphones,      exact: false },
  { label: "Writing",   path: "/dashboard/writing",   icon: PenTool,         exact: false },
  { label: "Speaking",  path: "/dashboard/speaking",  icon: Mic,             exact: false },
];

const MORE_GROUPS = [
  {
    label: "My Journey",
    items: [{ label: "My Journey", path: "/dashboard/study-plan", icon: Map }],
  },
  {
    label: "Overview",
    items: [
      { label: "Diagnostic",    path: "/dashboard/diagnostic", icon: Target },
      { label: "Progress Stats",path: "/dashboard/stats",      icon: BarChart3 },
      { label: "Settings",      path: "/dashboard/settings",   icon: Settings },
    ],
  },
  {
    label: "Pro",
    items: [
      { label: "Revision Notes", path: "/dashboard/revision-notes", icon: Layers },
      { label: "Flashcards",     path: "/dashboard/flashcards",     icon: FlipHorizontal },
      { label: "Study Groups",   path: "/dashboard/group",          icon: Users },
    ],
  },
  {
    label: "Elite",
    items: [{ label: "Elite Hub", path: "/dashboard/elite", icon: Crown }],
  },
];

export function MobileBottomNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleMore = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Bottom nav bar */}
      <nav
        aria-label="Module navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-6">
          {PRIMARY.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center gap-1 w-full py-3 text-[10px] transition-colors touch-manipulation ${
                      isActive ? "text-accent" : "text-muted-foreground"
                    }`
                  }
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setOpen(true)}
              className={`flex flex-col items-center justify-center gap-1 w-full py-3 text-[10px] transition-colors touch-manipulation ${
                open ? "text-accent" : "text-muted-foreground"
              }`}
              aria-label="More"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* More sheet overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className="relative bg-background rounded-t-2xl border-t border-border/60 pb-safe max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 sticky top-0 bg-background z-10">
              <p className="text-sm font-medium text-foreground">All sections</p>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 space-y-1">
              {MORE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleMore(item.path)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ))}

              {isAdmin && (
                <div>
                  <p className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Admin
                  </p>
                  <button
                    onClick={() => handleMore("/admin")}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    Admin Portal
                  </button>
                </div>
              )}
            </div>
            {/* safe area spacer */}
            <div style={{ height: "env(safe-area-inset-bottom, 16px)" }} />
          </div>
        </div>
      )}
    </>
  );
}
