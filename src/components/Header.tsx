import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "How it works", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartFree = () => {
    setIsMobileMenuOpen(false);
    navigate("/auth?mode=signup");
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate("/auth");
  };

  return (
    <>
      {/* Desktop — floating pill nav */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden lg:flex justify-center pt-5 px-6 pointer-events-none">
        <div
          className="pointer-events-auto flex items-center gap-1 pl-4 pr-1.5 rounded-full transition-all duration-300"
          style={{
            background: isScrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.78)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(14,56,96,0.10)",
            boxShadow: isScrolled
              ? "0 4px 24px rgba(14,56,96,0.12), 0 1px 4px rgba(14,56,96,0.06)"
              : "0 2px 14px rgba(14,56,96,0.07)",
            height: 44,
          }}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 mr-3 text-[17px] font-light tracking-tight" style={{ color: "#0A1C40" }}>
            <img src="/logo.svg" alt="Engvolve" className="w-7 h-7" />
            Eng<span style={{ color: "#48A8CC", fontWeight: 500 }}>volve</span>
          </a>

          {/* Divider */}
          <div className="w-px h-4 mx-1 shrink-0" style={{ background: "rgba(14,56,96,0.12)" }} />

          {/* Nav links — tight */}
          <nav className="flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm transition-colors duration-200 whitespace-nowrap"
                style={{ color: "rgba(10,28,64,0.60)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#0A1C40")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(10,28,64,0.60)")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-px h-4 mx-1 shrink-0" style={{ background: "rgba(14,56,96,0.12)" }} />

          {/* CTAs */}
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={handleLogin}
              className="px-3 py-1.5 text-sm rounded-full transition-colors duration-200"
              style={{ color: "rgba(10,28,64,0.60)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0A1C40")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(10,28,64,0.60)")}
            >
              Log in
            </button>
            <button
              onClick={handleStartFree}
              className="relative overflow-hidden px-4 py-1.5 rounded-full text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #48A8CC 0%, #185688 100%)",
                animation: "btnGlow 2.6s ease-in-out infinite",
              }}
            >
              <span aria-hidden className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)", animation: "btnShimmer 2.8s ease-in-out infinite", animationDelay: "1.6s" }} />
              Start free
            </button>
          </div>
        </div>
      </header>

      {/* Mobile — simple top bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ${
          isScrolled ? "py-3" : "py-5"
        }`}
        style={{ background: isScrolled ? "rgba(255,255,255,0.90)" : "transparent", backdropFilter: isScrolled ? "blur(16px)" : "none", borderBottom: isScrolled ? "1px solid rgba(14,56,96,0.08)" : "none" }}
      >
        <div className="flex items-center justify-between px-5">
          <a href="#" className="flex items-center gap-2 text-xl font-light" style={{ color: isScrolled ? "#0A1C40" : "#FFFFFF" }}>
            <img src="/logo.svg" alt="Engvolve" className="w-8 h-8" />
            Eng<span style={{ color: isScrolled ? "#48A8CC" : "#FFE4A0", fontWeight: 500 }}>volve</span>
          </a>
          <button
            className="p-2"
            style={{ color: isScrolled ? "#0A1C40" : "#FFFFFF" }}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative h-full flex flex-col items-center justify-center gap-8 px-6">
          <button
            className="absolute top-6 right-6 text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-light text-foreground hover:text-accent transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 w-full max-w-xs mt-6">
            <Button variant="neumorphicPrimary" size="lg" onClick={handleStartFree}>
              Start free
            </Button>
            <Button variant="ghost" size="lg" onClick={handleLogin}>
              Log in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
