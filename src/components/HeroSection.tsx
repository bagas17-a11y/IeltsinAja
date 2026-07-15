import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { ArrowRight, GraduationCap, Target } from "lucide-react";
import { buildWhatsAppLink, CONTACT_MESSAGES } from "@/lib/contact";

export const HeroSection = () => {
  const navigate = useNavigate();
  const screenRef = useRef<HTMLVideoElement>(null);
  const selfieRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-0">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs mb-8"
          style={{
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#FFE4A0" }} />
          AI-powered · Built by 8.5+ scorers & Berkeley alumni · For Indonesian students
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: "easeOut" }}
          className="leading-[1.10] mb-5 max-w-3xl"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            fontWeight: 300,
            color: "#FFFFFF",
          }}
        >
          Indonesia's Gateway to<br />
          <motion.span
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.92, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontWeight: 600, color: "#FFE4A0", display: "inline-block" }}
          >
            Global Education.
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.05, ease: "easeOut" }}
          className="text-sm md:text-base max-w-lg mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.70)", fontWeight: 300 }}
        >
          Score 7.0+ on IELTS. Write essays that get you into Oxford, Harvard, or IUP.
          Two services — one coach in your pocket.
        </motion.p>

        {/* Dual service CTA cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.18, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 mb-14 w-full max-w-xl"
        >
          {/* IELTS card */}
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className="group flex-1 flex flex-col items-start gap-2 px-5 py-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
            style={{
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.28)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: "rgba(72,168,204,0.35)", border: "1px solid rgba(72,168,204,0.5)" }}>
                <Target className="w-3.5 h-3.5" style={{ color: "#7EDCF5" }} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>IELTS Prep</span>
            </div>
            <p className="text-sm font-semibold leading-snug" style={{ color: "#FFFFFF" }}>
              Score 7.0+ with AI-powered practice
            </p>
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#7EDCF5" }}>
              Start free trial <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Uni Essays card */}
          <button
            onClick={() => window.open(buildWhatsAppLink(CONTACT_MESSAGES.essayCoaching), "_blank")}
            className="group flex-1 flex flex-col items-start gap-2 px-5 py-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
            style={{
              background: "rgba(255,228,160,0.12)",
              border: "1px solid rgba(255,228,160,0.30)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: "rgba(255,228,160,0.22)", border: "1px solid rgba(255,228,160,0.40)" }}>
                <GraduationCap className="w-3.5 h-3.5" style={{ color: "#FFE4A0" }} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,228,160,0.65)" }}>Uni Essays</span>
            </div>
            <p className="text-sm font-semibold leading-snug" style={{ color: "#FFFFFF" }}>
              Oxford. Harvard. IUP. — essay coaching by alumni
            </p>
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#FFE4A0" }}>
              Book free consultation <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Mac desktop video demo */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl mx-auto"
        >
          {/* Ambient glow */}
          <div className="absolute -inset-4 -bottom-10 rounded-3xl pointer-events-none" style={{
            background: "radial-gradient(ellipse at center bottom, rgba(72,168,204,0.25) 0%, transparent 65%)",
            filter: "blur(28px)",
          }} />

          <div style={{ animation: "float 7s ease-in-out 1.4s infinite" }}>
            {/* Mac desktop shell */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1e4f82 0%, #0e3860 45%, #071e3d 100%)",
                border: "1px solid rgba(72,168,204,0.22)",
                boxShadow: "0 32px 80px rgba(4,16,40,0.65), 0 0 0 1px rgba(72,168,204,0.08)",
                padding: "10px 12px 8px 12px",
              }}
            >
              {/* macOS menu bar */}
              <div
                className="relative z-10 flex items-center justify-between px-3 py-1 mb-2 rounded-md"
                style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "0.60rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Engvolve</span>
                  {["File", "View", "Help"].map(m => (
                    <span key={m} style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.38)" }}>{m}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.38)" }}>Wed 1:35 PM</span>
                  <span style={{ fontSize: "0.60rem", color: "rgba(255,255,255,0.50)" }}>🔋 WiFi ◼</span>
                </div>
              </div>

              {/* Floating app window */}
              <div
                className="relative z-10 rounded-xl overflow-hidden"
                style={{
                  background: "#0D1628",
                  border: "1px solid rgba(72,168,204,0.18)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.50)",
                }}
              >
                {/* Window title bar */}
                <div
                  className="flex items-center gap-2 px-4 py-2"
                  style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(72,168,204,0.10)" }}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: "#FF5F57", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.22)" }} />
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: "#FFBD2E", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.16)" }} />
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: "#28C840", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12)" }} />
                  <span style={{ flex: 1, textAlign: "center", fontSize: "0.60rem", color: "rgba(255,255,255,0.28)" }}>
                    Engvolve — IELTS Preparation
                  </span>
                </div>

                {/* Screen recording + PIP overlay */}
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <video
                    ref={screenRef}
                    src="/videos/demo.mov"
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    className="w-full h-full object-cover block"
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Talking-head PIP */}
                  <div
                    className="absolute bottom-3 right-3 rounded-xl overflow-hidden"
                    style={{
                      width: "22%",
                      aspectRatio: "3/4",
                      border: "2px solid rgba(255,255,255,0.18)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                      background: "#1a2840",
                    }}
                  >
                    <video
                      ref={selfieRef}
                      src="/videos/selfie.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      className="w-full h-full object-cover block"
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                </div>
              </div>

              {/* macOS Dock */}
              <div className="relative z-10 flex justify-center mt-2">
                <div
                  className="flex items-end gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.09)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.11)",
                  }}
                >
                  {[
                    { bg: "linear-gradient(135deg,#48A8CC,#185688)", label: "E" },
                    { bg: "#4ade80", label: "" },
                    { bg: "#f97316", label: "" },
                    { bg: "#8b5cf6", label: "" },
                    { bg: "#ec4899", label: "" },
                    { bg: "rgba(255,255,255,0.15)", label: "" },
                  ].map((app, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: app.bg }}
                    >
                      {app.label && <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "#fff" }}>{app.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
