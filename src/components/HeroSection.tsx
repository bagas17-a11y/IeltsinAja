import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "./HeroBackground";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-24">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs mb-8 animate-entrance"
          style={{
            border: "1px solid rgba(14,50,140,0.18)",
            background: "rgba(14,50,140,0.07)",
            backdropFilter: "blur(8px)",
            color: "rgba(14,50,140,0.75)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#22c55e" }} />
          AI-powered · Built by 8.5+ scorers · For Indonesian students
        </div>

        {/* Headline */}
        <h1
          className="font-bold leading-[1.05] mb-6 max-w-3xl animate-entrance"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.25rem)",
            color: "#0a1c50",
            animationDelay: "100ms",
          }}
        >
          Reach your IELTS<br />
          <span style={{ color: "#1a65e8" }}>target band.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg max-w-md mb-10 animate-entrance"
          style={{ color: "#4b5a78", animationDelay: "200ms" }}
        >
          Practice all 4 modules with instant AI band-score feedback.
          Expert coaching built for Indonesian learners.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-entrance"
          style={{ animationDelay: "300ms" }}
        >
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95"
            style={{ background: "#0f2060", color: "#ffffff" }}
          >
            Start free
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#pricing"
            className="px-7 py-3 rounded-full text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              border: "1px solid rgba(15,32,96,0.30)",
              color: "#0f2060",
            }}
          >
            See pricing
          </a>
        </div>

        {/* Product mockup */}
        <div
          className="relative w-full max-w-4xl mx-auto animate-entrance"
          style={{ animationDelay: "450ms" }}
        >
          {/* Floating glow */}
          <div
            className="absolute -inset-8 rounded-3xl pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(30,100,220,0.14) 0%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />

          {/* Mockup with gentle float */}
          <div style={{ animation: "float 6s ease-in-out 1.3s infinite" }}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(8,16,42,0.92)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 32px 80px rgba(10,28,80,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,87,0.60)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,189,46,0.60)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "rgba(40,201,64,0.60)" }} />
                <div className="flex-1 flex justify-center">
                  <div
                    className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.28)",
                      fontSize: "0.68rem",
                      minWidth: "180px",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    mumpuni.app
                  </div>
                </div>
              </div>

              {/* 16:9 content area */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  aspectRatio: "16 / 9",
                  background: "linear-gradient(135deg, #080e22 0%, #0e2060 50%, #162f80 100%)",
                }}
              >
                {/* Subtle grid for depth */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                  }}
                />

                {/* Play button */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <button
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow: "0 0 40px rgba(255,255,255,0.06)",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <p style={{ color: "rgba(255,255,255,0.32)", fontSize: "0.82rem" }}>
                    Watch how Mumpuni works
                  </p>
                </div>

                {/* UI hints to suggest real app */}
                <div
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "#4ade80" }} />
                  <span style={{ color: "rgba(255,255,255,0.40)", fontSize: "0.68rem" }}>Live Practice Mode</span>
                </div>

                <div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(245,188,96,0.12)",
                    border: "1px solid rgba(245,188,96,0.22)",
                  }}
                >
                  <span style={{ color: "#f5bc60", fontSize: "0.68rem", fontWeight: 600 }}>Band 7.5 · Task 2</span>
                </div>

                {/* Progress bar */}
                <div
                  className="absolute bottom-4 left-4 right-4 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #4ade80, #60a8e0)",
                      width: "68%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
