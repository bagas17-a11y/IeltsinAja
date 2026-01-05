import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Reading", href: "#reading" },
  { label: "Listening", href: "#listening" },
  { label: "Writing", href: "#writing" },
  { label: "Speaking", href: "#speaking" },
  { label: "Get Me Started Now!", href: "#pricing" },
];
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "header-blur py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-2xl font-light tracking-tight text-foreground">
            IELTS<span className="text-accent font-medium">inAja</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => <a key={link.label} href={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300">
                {link.label}
              </a>)}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="neumorphicPrimary" size="sm" onClick={() => navigate("/auth")}>
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-foreground p-2" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 lg:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative h-full flex flex-col items-center justify-center gap-8">
          <button className="absolute top-6 right-6 text-foreground p-2" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
          {navLinks.map((link, index) => <a key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-accent transition-colors animate-fade-in" style={{
          animationDelay: `${index * 100}ms`
        }}>
              {link.label}
            </a>)}
          <Button variant="neumorphicPrimary" size="lg" className="mt-8 animate-fade-in" style={{
          animationDelay: "500ms"
        }} onClick={() => { setIsMobileMenuOpen(false); navigate("/auth"); }}>
            Login
          </Button>
        </div>
      </div>
    </>;
};