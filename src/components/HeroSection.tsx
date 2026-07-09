import { useNavigate } from "react-router-dom";
import { HeroBackground } from "./HeroBackground";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-0">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs mb-8 animate-entrance"
          style={{
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#FFE4A0" }} />
          AI-powered · Built by 8.5+ scorers · For Indonesian students
        </div>

        {/* Headline */}
        <h1
          className="leading-[1.10] mb-5 max-w-3xl animate-entrance"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            fontWeight: 300,
            color: "#FFFFFF",
            animationDelay: "100ms",
          }}
        >
          Indonesia's First Ever<br />
          <span style={{ fontWeight: 600, color: "#FFE4A0" }}>All-in-one IELTS</span>
          <br />
          <span style={{ fontWeight: 300 }}>Prep Platform.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-sm md:text-base max-w-lg mb-10 leading-relaxed animate-entrance"
          style={{ color: "rgba(255,255,255,0.70)", animationDelay: "200ms", fontWeight: 300 }}
        >
          Engvolve gives you personalised feedback, real Band 6.5+ strategies, and a coach in
          your pocket — built by scorers who've been where you are.
        </p>


        {/* Product mockup — writing feedback panel, docked on ocean */}
        <div
          className="relative w-full max-w-4xl mx-auto animate-entrance"
          style={{ animationDelay: "480ms" }}
        >
          {/* Glow beneath */}
          <div className="absolute -inset-4 -bottom-10 rounded-3xl pointer-events-none" style={{
            background: "radial-gradient(ellipse at center bottom, rgba(72,168,204,0.22) 0%, transparent 65%)",
            filter: "blur(24px)",
          }} />

          {/* Float */}
          <div style={{ animation: "float 7s ease-in-out 1.4s infinite" }}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "#0D1628",
                border: "1px solid rgba(72,168,204,0.14)",
                boxShadow: "0 24px 64px rgba(8,32,64,0.45), 0 0 0 1px rgba(72,168,204,0.07)",
              }}
            >
              {/* App chrome bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(72,168,204,0.10)",
                }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,87,0.55)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,189,46,0.55)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(40,201,64,0.55)" }} />
                <div className="flex-1 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: "rgba(72,168,204,0.80)", fontSize: "0.72rem", fontWeight: 600 }}>Engvolve</span>
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

              {/* Main content */}
              <div className="grid grid-cols-5" style={{ minHeight: "270px" }}>

                {/* Essay + annotations */}
                <div className="col-span-3 p-5 border-r" style={{ borderColor: "rgba(72,168,204,0.07)" }}>
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    Your Response
                  </p>
                  <div style={{ fontSize: "0.74rem", lineHeight: 1.75, color: "rgba(200,220,240,0.68)" }}>
                    <span>In recent years, the rise of social media has fundamentally altered how people </span>
                    <span className="relative inline-block">
                      <span style={{ borderBottom: "2px solid rgba(72,168,204,0.65)", color: "rgba(110,196,230,0.92)" }}>
                        communicate and share information
                      </span>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] px-2 py-0.5 rounded-full pointer-events-none"
                            style={{ background: "rgba(72,168,204,0.15)", border: "1px solid rgba(72,168,204,0.32)", color: "#6EC8E8" }}>
                        ✦ Strong noun phrase
                      </span>
                    </span>
                    <span>. While some argue this has brought communities closer together, others contend it has led to </span>
                    <span className="relative inline-block">
                      <span style={{ borderBottom: "2px solid rgba(245,128,58,0.55)", color: "rgba(245,180,130,0.85)" }}>
                        misinformation and social isolation
                      </span>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] px-2 py-0.5 rounded-full pointer-events-none"
                            style={{ background: "rgba(245,128,58,0.12)", border: "1px solid rgba(245,128,58,0.30)", color: "#F5803A" }}>
                        ⚡ Develop this further
                      </span>
                    </span>
                    <span>. This essay argues that the benefits outweigh the drawbacks when social media is used responsibly.</span>
                  </div>
                </div>

                {/* Band score sidebar */}
                <div className="col-span-2 p-5">
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                    AI Feedback
                  </p>
                  {[
                    { label: "Task Achievement", score: 7,   color: "#6EC8E8" },
                    { label: "Coherence & Cohesion", score: 7, color: "#6EC8E8" },
                    { label: "Lexical Resource",   score: 6.5, color: "#F5BC3C" },
                    { label: "Grammatical Range",  score: 7.5, color: "#4ade80" },
                  ].map(({ label, score, color }) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ fontSize: "0.60rem", color: "rgba(180,210,240,0.52)" }}>{label}</span>
                        <span style={{ fontSize: "0.67rem", fontWeight: 700, color }}>{score}</span>
                      </div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 99, background: color, width: `${(score / 9) * 100}%`, opacity: 0.70 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tutor chat bar */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: "1px solid rgba(72,168,204,0.09)", background: "rgba(72,168,204,0.03)" }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: "rgba(72,168,204,0.16)", border: "1px solid rgba(72,168,204,0.28)" }}>
                  <span style={{ fontSize: 10, color: "#6EC8E8" }}>✦</span>
                </div>
                <span style={{ flex: 1, fontSize: "0.71rem", color: "rgba(180,210,240,0.36)", textAlign: "left" }}>
                  Ask your AI Tutor about this essay, or{" "}
                  <kbd style={{
                    display: "inline-block", padding: "0px 4px", borderRadius: 4,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
                    fontSize: "0.59rem", color: "rgba(180,210,240,0.48)", fontFamily: "monospace",
                  }}>⏎</kbd>
                  {" "}for instant feedback
                </span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: "linear-gradient(135deg, #48A8CC, #185688)" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
