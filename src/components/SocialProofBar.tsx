import { ShieldCheck, Users, MessageSquare, Sparkles, Globe, Star, Trophy, Zap } from "lucide-react";

const trustItems = [
  { icon: Users, label: "Built by 8.5+ IELTS scorers" },
  { icon: Globe, label: "Indonesia-based founding team" },
  { icon: Sparkles, label: "AI feedback on every practice" },
  { icon: MessageSquare, label: "WhatsApp support in Bahasa" },
  { icon: ShieldCheck, label: "Manual review before approval" },
  { icon: Star, label: "4.9 / 5 student rating" },
  { icon: Trophy, label: "Students hit Band 8+ on Elite" },
  { icon: Zap, label: "Band-score feedback in seconds" },
];

export const SocialProofBar = () => {
  return (
    <section className="py-8 border-y border-border/50 bg-secondary/20 overflow-hidden">
      <p className="text-center text-[10px] text-muted-foreground/60 mb-5 tracking-widest uppercase">
        Why IELTS candidates trust Eng-InAja
      </p>

      {/* Double-track so translateX(-50%) loops seamlessly */}
      <div className="marquee-track">
        <div className="animate-marquee flex gap-5 w-max">
          {[...trustItems, ...trustItems].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/40 border border-border/40 flex-shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span className="text-xs text-foreground/75 whitespace-nowrap">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/50 mt-5 max-w-xl mx-auto px-6">
        Independent IELTS-prep product in pilot — not affiliated with British Council, IDP, or Cambridge.
      </p>
    </section>
  );
};
