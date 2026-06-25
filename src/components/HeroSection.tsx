import { useState } from "react";
import { ArrowRight, MessageCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroBackground } from "./HeroBackground";
import { buildWhatsAppLink } from "@/lib/contact";

const SUGGESTIONS = [
  "How does EngInAja work?",
  "What plan is right for me?",
  "How do I improve my Writing band?",
];

export const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleSend = () => {
    if (query.trim()) setShowOptions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const whatsappMsg = query.trim()
    ? `Hi EngInAja! I have a question: ${query}`
    : "Hi EngInAja! I have a question about the platform.";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-atmospheric overflow-hidden">
      <HeroBackground />
      <div className="noise-overlay" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-glow-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-glow-warm/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy/50 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Big bold headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] mb-6 uppercase tracking-tight animate-entrance">
            <span className="block text-white">REACH YOUR</span>
            <span className="block text-gradient">IELTS TARGET</span>
            <span className="block text-white">BAND.</span>
          </h1>

          <p className="text-base md:text-lg text-foreground/60 mb-10 max-w-lg mx-auto animate-entrance" style={{ animationDelay: "150ms" }}>
            AI-powered practice + expert coaching for Indonesian students. Built by 8.5+ scorers.
          </p>

          {/* Search / question bar */}
          <div className="max-w-2xl mx-auto animate-entrance" style={{ animationDelay: "250ms" }}>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowOptions(false); }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about IELTS or EngInAja..."
                className="flex-1 bg-transparent text-foreground placeholder:text-foreground/30 outline-none text-sm md:text-base"
              />
              <button
                onClick={handleSend}
                disabled={!query.trim()}
                className="w-9 h-9 rounded-xl bg-accent/20 hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              >
                <ArrowRight className="w-4 h-4 text-accent" />
              </button>
            </div>

            {/* Suggestion chips */}
            {!showOptions && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {SUGGESTIONS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => { setQuery(chip); setShowOptions(true); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-foreground/40 hover:border-accent/30 hover:text-foreground/70 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Action options after send */}
            {showOptions && (
              <div className="flex flex-col sm:flex-row gap-3 mt-5 justify-center animate-entrance">
                <a
                  href={buildWhatsAppLink(whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#4ade80] hover:bg-[#25D366]/20 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask on WhatsApp
                </a>
                <button
                  onClick={() => navigate("/auth?mode=signup")}
                  className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Create a free account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
