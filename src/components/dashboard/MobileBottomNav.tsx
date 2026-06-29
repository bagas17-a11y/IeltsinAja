import { NavLink } from "react-router-dom";
import { BookOpen, Headphones, PenTool, Mic, LayoutDashboard } from "lucide-react";

/**
 * Sticky bottom navigation for mobile dashboard.
 * Uses NavLink so the browser handles touch events natively (better than button+navigate).
 * z-50 ensures it stays above module overlays and sheets (which use z-40/z-50 in shadcn).
 * Hidden on md+ screens where the sidebar handles navigation.
 */
const items = [
  { label: "Home", path: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Reading", path: "/dashboard/reading", icon: BookOpen, exact: false },
  { label: "Listening", path: "/dashboard/listening", icon: Headphones, exact: false },
  { label: "Writing", path: "/dashboard/writing", icon: PenTool, exact: false },
  { label: "Speaking", path: "/dashboard/speaking", icon: Mic, exact: false },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Module navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
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
      </ul>
    </nav>
  );
}
