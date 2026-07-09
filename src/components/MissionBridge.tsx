import { useEffect, useRef, useState } from "react";

const reasons = [
  {
    stat: "0.5–1.5 bands",
    label: "average score jump",
    body: "Students improve by 0.5–1.5 bands in their first retake after just 4 weeks on Engvolve — compared to the national average of zero band improvement between attempts.",
    icon: "📈",
  },
  {
    stat: "92%",
    label: "of users agree",
    body: "Report that AI feedback addressed their exact weak points — not generic tips. Something no textbook, YouTube channel, or static course can replicate.",
    icon: "🎯",
  },
  {
    stat: "500+",
    label: "scholarship awardees",
    body: "Trust Engvolve's LPDP, Chevening, and Fulbright-specific roadmaps. The only IELTS platform with full Bahasa support and Jakarta-hours live coaching.",
    icon: "🏅",
  },
];

export const MissionBridge = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsRevealed(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">

        {/* Heading */}
        <div
          className={`text-center mb-14 transition-all duration-500 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.15em] mb-3" style={{ color: "#48A8CC" }}>
            Why students choose Engvolve
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight"
            style={{ color: "#0A1C40" }}
          >
            Why Indonesian students prefer{" "}
            <span style={{ color: "#48A8CC", fontWeight: 600 }}>Engvolve</span>
            {" "}for IELTS prep
          </h2>
        </div>

        {/* 3 stat cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`rounded-2xl p-7 text-left transition-all duration-500 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${i * 90}ms`,
                transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
                background: "rgba(72,168,204,0.05)",
                border: "1px solid rgba(72,168,204,0.15)",
              }}
            >
              <span className="text-2xl mb-5 block">{r.icon}</span>
              <p className="mb-1 leading-none">
                <span
                  className="font-bold"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#48A8CC", lineHeight: 1 }}
                >
                  {r.stat}
                </span>
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#0A1C40" }}>
                {r.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(10,28,64,0.62)" }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
