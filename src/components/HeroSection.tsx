import { useNavigate } from "react-router-dom";
import { HeroBackground } from "./HeroBackground";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "#0B0F1C" }}>
      <HeroBackground />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-0">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs mb-8 animate-entrance"
          style={{
            border: "1px solid rgba(110,206,245,0.28)",
            background: "rgba(110,206,245,0.08)",
            color: "rgba(110,206,245,0.85)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#6ECEF5" }} />
          #1 AI IELTS Platform · Built by 8.5+ scorers · For Indonesian students
        </div>

        {/* Headline */}
        <h1
          className="font-serif font-bold leading-[1.08] mb-5 max-w-3xl animate-entrance"
          style={{
            fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
            color: "#F0F4FF",
            animationDelay: "100ms",
          }}
        >
          #1 AI Companion for Your<br />
          <span style={{ color: "#6ECEF5" }}>IELTS Journey.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-sm md:text-base max-w-xl mb-10 leading-relaxed animate-entrance"
          style={{ color: "rgba(180,210,240,0.65)", animationDelay: "200ms", fontWeight: 300 }}
        >
          Mumpuni gives you personalised feedback, real Band 6.5+ strategies, and a coach in
          your pocket — built by scorers who've been where you are.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mb-14 animate-entrance"
          style={{ animationDelay: "300ms" }}
        >
          {/* Primary — cyan-to-orange gradient */}
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className="px-8 py-3 rounded-full font-semibold text-sm text-white transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6ECEF5 0%, #F5803A 100%)",
              boxShadow: "0 4px 24px rgba(110,206,245,0.30)",
            }}
          >
            Mulai Gratis
          </button>

          {/* Secondary — elite gold outline */}
          <button
            onClick={() => navigate("/auth?mode=signup&plan=elite")}
            className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-white/5"
            style={{
              border: "1px solid rgba(245,188,60,0.55)",
              color: "#F5BC3C",
            }}
          >
            See Elite Coaching
          </button>
        </div>

        {/* Product mockup — Writing feedback panel, docked on ocean */}
        <div
          className="relative w-full max-w-4xl mx-auto animate-entrance"
          style={{ animationDelay: "480ms" }}
        >
          {/* Floating glow beneath mockup */}
          <div className="absolute -inset-4 -bottom-10 rounded-3xl pointer-events-none" style={{
            background: "radial-gradient(ellipse at center bottom, rgba(110,206,245,0.18) 0%, transparent 65%)",
            filter: "blur(24px)",
          }} />

          {/* Gentle float animation */}
          <div style={{ animation: "float 7s ease-in-out 1.4s infinite" }}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "#0D1628",
                border: "1px solid rgba(110,206,245,0.12)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.60), 0 0 0 1px rgba(110,206,245,0.06)",
              }}
            >
              {/* App chrome bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(110,206,245,0.08)",
                }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,87,0.55)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,189,46,0.55)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(40,201,64,0.55)" }} />
                <div className="flex-1 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: "rgba(110,206,245,0.70)", fontSize: "0.72rem", fontWeight: 600 }}>Mumpuni</span>
                    <span style={{ color: "rgba(255,255,255,0.20)", fontSize: "0.72rem" }}>·</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>Writing Task 2 · Academic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{
                      color: "#F5BC3C", fontSize: "0.65rem", fontWeight: 700,
                      background: "rgba(245,188,60,0.10)", padding: "2px 8px", borderRadius: 99,
                      border: "1px solid rgba(245,188,60,0.25)",
                    }}>Band 7.0</span>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem" }}>⏱ 21:35</span>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="grid grid-cols-5" style={{ minHeight: "280px" }}>

                {/* Left — essay with annotations */}
                <div className="col-span-3 p-5 border-r" style={{ borderColor: "rgba(110,206,245,0.06)" }}>
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    Your Response
                  </p>
                  <div style={{ fontSize: "0.75rem", lineHeight: 1.7, color: "rgba(200,220,240,0.70)" }}>
                    <span>In recent years, the rise of social media has fundamentally altered how people </span>
                    <span className="relative inline-block">
                      <span style={{
                        borderBottom: "2px solid rgba(110,206,245,0.60)",
                        color: "rgba(110,206,245,0.90)",
                      }}>communicate and share information</span>
                      {/* Annotation bubble */}
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] px-2 py-0.5 rounded-full pointer-events-none"
                            style={{
                              background: "rgba(110,206,245,0.15)",
                              border: "1px solid rgba(110,206,245,0.30)",
                              color: "#6ECEF5",
                            }}>
                        ✦ Strong noun phrase
                      </span>
                    </span>
                    <span>. While some argue this has brought communities closer together, others contend it has led to increased </span>
                    <span className="relative inline-block">
                      <span style={{
                        borderBottom: "2px solid rgba(245,128,58,0.55)",
                        color: "rgba(245,180,130,0.85)",
                      }}>misinformation and social isolation</span>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] px-2 py-0.5 rounded-full pointer-events-none"
                            style={{
                              background: "rgba(245,128,58,0.12)",
                              border: "1px solid rgba(245,128,58,0.30)",
                              color: "#F5803A",
                            }}>
                        ⚡ Develop this further
                      </span>
                    </span>
                    <span>. This essay will examine both perspectives before arguing that the benefits </span>
                    <span style={{ color: "rgba(200,220,240,0.70)" }}>outweigh the drawbacks when social media is used responsibly.</span>
                  </div>
                </div>

                {/* Right — AI feedback scores */}
                <div className="col-span-2 p-5">
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                    AI Feedback
                  </p>
                  {[
                    { label: "Task Achievement", score: 7, color: "#6ECEF5" },
                    { label: "Coherence & Cohesion", score: 7, color: "#6ECEF5" },
                    { label: "Lexical Resource", score: 6.5, color: "#F5BC3C" },
                    { label: "Grammatical Range", score: 7.5, color: "#4ade80" },
                  ].map(({ label, score, color }) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ fontSize: "0.62rem", color: "rgba(180,210,240,0.55)" }}>{label}</span>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color }}>{score}</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99,
                          background: color,
                          width: `${(score / 9) * 100}%`,
                          opacity: 0.7,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tutor input bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderTop: "1px solid rgba(110,206,245,0.08)",
                  background: "rgba(110,206,245,0.03)",
                }}
              >
                {/* Cyan AI dot */}
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: "rgba(110,206,245,0.15)", border: "1px solid rgba(110,206,245,0.25)" }}>
                  <span style={{ fontSize: 10, color: "#6ECEF5" }}>✦</span>
                </div>
                <span style={{ flex: 1, fontSize: "0.72rem", color: "rgba(180,210,240,0.38)", textAlign: "left" }}>
                  Ask your AI Tutor about this essay, or{" "}
                  <kbd style={{
                    display: "inline-block", padding: "0px 4px", borderRadius: 4,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
                    fontSize: "0.6rem", color: "rgba(180,210,240,0.50)", fontFamily: "monospace",
                  }}>⏎</kbd>
                  {" "}for instant feedback
                </span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: "linear-gradient(135deg, #6ECEF5, #F5803A)" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </div>

              {/* Ocean dock fade — bottom of mockup dissolves into the water */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none" style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(6,10,20,0.92) 100%)",
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
