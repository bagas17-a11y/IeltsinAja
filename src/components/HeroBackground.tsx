const STARS = [
  { l: "4%",  t: "7%",  s: "1px",   o: 0.55, d: "0s",    dr: "3.2s" },
  { l: "11%", t: "23%", s: "1.5px", o: 0.40, d: "1.1s",  dr: "2.6s" },
  { l: "18%", t: "54%", s: "1px",   o: 0.70, d: "0.4s",  dr: "3.8s" },
  { l: "26%", t: "14%", s: "2px",   o: 0.30, d: "2.3s",  dr: "2.9s" },
  { l: "33%", t: "78%", s: "1px",   o: 0.60, d: "0.7s",  dr: "4.1s" },
  { l: "41%", t: "38%", s: "1.5px", o: 0.45, d: "1.8s",  dr: "3.0s" },
  { l: "48%", t: "91%", s: "1px",   o: 0.35, d: "3.1s",  dr: "2.4s" },
  { l: "55%", t: "19%", s: "2px",   o: 0.65, d: "0.2s",  dr: "3.5s" },
  { l: "62%", t: "67%", s: "1px",   o: 0.50, d: "1.5s",  dr: "4.3s" },
  { l: "70%", t: "44%", s: "1.5px", o: 0.40, d: "2.8s",  dr: "2.8s" },
  { l: "77%", t: "82%", s: "1px",   o: 0.60, d: "0.9s",  dr: "3.6s" },
  { l: "84%", t: "11%", s: "2px",   o: 0.35, d: "3.5s",  dr: "2.2s" },
  { l: "91%", t: "59%", s: "1px",   o: 0.70, d: "1.3s",  dr: "4.0s" },
  { l: "96%", t: "30%", s: "1.5px", o: 0.45, d: "0.6s",  dr: "3.3s" },
  { l: "8%",  t: "88%", s: "1px",   o: 0.55, d: "2.1s",  dr: "2.7s" },
  { l: "15%", t: "43%", s: "2px",   o: 0.30, d: "4.0s",  dr: "3.9s" },
  { l: "22%", t: "72%", s: "1px",   o: 0.65, d: "0.5s",  dr: "2.5s" },
  { l: "30%", t: "6%",  s: "1.5px", o: 0.50, d: "1.7s",  dr: "4.2s" },
  { l: "37%", t: "55%", s: "1px",   o: 0.40, d: "3.3s",  dr: "3.1s" },
  { l: "45%", t: "27%", s: "2px",   o: 0.60, d: "0.8s",  dr: "2.3s" },
  { l: "52%", t: "83%", s: "1px",   o: 0.35, d: "2.5s",  dr: "3.7s" },
  { l: "59%", t: "48%", s: "1.5px", o: 0.70, d: "1.2s",  dr: "4.4s" },
  { l: "67%", t: "15%", s: "1px",   o: 0.45, d: "3.8s",  dr: "2.6s" },
  { l: "74%", t: "71%", s: "2px",   o: 0.55, d: "0.3s",  dr: "3.0s" },
  { l: "81%", t: "36%", s: "1px",   o: 0.40, d: "2.0s",  dr: "3.4s" },
  { l: "88%", t: "92%", s: "1.5px", o: 0.65, d: "1.6s",  dr: "2.8s" },
  { l: "94%", t: "50%", s: "1px",   o: 0.30, d: "4.2s",  dr: "4.0s" },
  { l: "2%",  t: "33%", s: "2px",   o: 0.60, d: "0.1s",  dr: "2.4s" },
  { l: "13%", t: "65%", s: "1px",   o: 0.50, d: "2.7s",  dr: "3.8s" },
  { l: "20%", t: "9%",  s: "1.5px", o: 0.35, d: "1.4s",  dr: "3.2s" },
  { l: "28%", t: "47%", s: "1px",   o: 0.70, d: "3.6s",  dr: "2.9s" },
  { l: "35%", t: "86%", s: "2px",   o: 0.45, d: "0.6s",  dr: "4.1s" },
  { l: "43%", t: "21%", s: "1px",   o: 0.55, d: "1.9s",  dr: "2.7s" },
  { l: "50%", t: "61%", s: "1.5px", o: 0.40, d: "3.2s",  dr: "3.5s" },
  { l: "57%", t: "4%",  s: "1px",   o: 0.65, d: "0.7s",  dr: "4.2s" },
  { l: "64%", t: "39%", s: "2px",   o: 0.30, d: "2.4s",  dr: "2.3s" },
  { l: "72%", t: "76%", s: "1px",   o: 0.60, d: "1.0s",  dr: "3.6s" },
  { l: "79%", t: "22%", s: "1.5px", o: 0.50, d: "3.9s",  dr: "2.8s" },
  { l: "86%", t: "58%", s: "1px",   o: 0.35, d: "0.4s",  dr: "4.0s" },
  { l: "93%", t: "85%", s: "2px",   o: 0.70, d: "2.2s",  dr: "3.1s" },
  { l: "6%",  t: "75%", s: "1px",   o: 0.45, d: "1.3s",  dr: "2.6s" },
  { l: "17%", t: "18%", s: "1.5px", o: 0.55, d: "3.4s",  dr: "3.9s" },
  { l: "24%", t: "90%", s: "1px",   o: 0.40, d: "0.9s",  dr: "2.4s" },
  { l: "32%", t: "32%", s: "2px",   o: 0.65, d: "2.6s",  dr: "3.3s" },
  { l: "39%", t: "69%", s: "1px",   o: 0.30, d: "1.6s",  dr: "4.3s" },
  { l: "47%", t: "41%", s: "1.5px", o: 0.60, d: "3.7s",  dr: "2.9s" },
  { l: "54%", t: "13%", s: "1px",   o: 0.50, d: "0.2s",  dr: "3.7s" },
  { l: "61%", t: "57%", s: "2px",   o: 0.35, d: "2.9s",  dr: "2.5s" },
  { l: "69%", t: "28%", s: "1px",   o: 0.70, d: "1.1s",  dr: "4.1s" },
  { l: "76%", t: "94%", s: "1.5px", o: 0.45, d: "3.0s",  dr: "3.0s" },
];

export const HeroBackground = () => {
  return (
    // No overflow-hidden here — the section itself clips; this div must not clip the moon/rocket
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>

      {/* ── Drifting aurora orbs ─────────────────────────── */}
      <div className="aurora-orb absolute rounded-full" style={{
        top: "10%", left: "45%",
        width: "550px", height: "550px",
        background: "hsl(200 80% 60% / 0.05)",
        filter: "blur(110px)",
        animationDelay: "0s",
      }} />
      <div className="aurora-orb absolute rounded-full" style={{
        top: "55%", left: "0%",
        width: "400px", height: "400px",
        background: "hsl(220 70% 45% / 0.06)",
        filter: "blur(90px)",
        animationDelay: "9s",
      }} />
      <div className="aurora-orb absolute rounded-full" style={{
        top: "20%", right: "5%",
        width: "460px", height: "460px",
        background: "hsl(200 90% 55% / 0.04)",
        filter: "blur(100px)",
        animationDelay: "4.5s",
      }} />

      {/* ── Star field ──────────────────────────────────── */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="star absolute rounded-full bg-white"
          style={{
            left: star.l, top: star.t,
            width: star.s, height: star.s,
            opacity: star.o,
            animationDelay: star.d,
            animationDuration: star.dr,
          }}
        />
      ))}

      {/* ── Moon — top-right, clearly in frame ──────────── */}
      <div
        className="animate-moon-glow absolute"
        style={{ top: "4%", right: "4%", zIndex: 1 }}
      >
        {/* Outer diffuse halo */}
        <div style={{
          position: "absolute",
          inset: "-70px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(200 80% 70% / 0.08) 35%, transparent 70%)",
          filter: "blur(35px)",
        }} />
        {/* Mid halo */}
        <div style={{
          position: "absolute",
          inset: "-25px",
          borderRadius: "50%",
          background: "hsl(200 75% 65% / 0.05)",
          filter: "blur(18px)",
        }} />

        <svg viewBox="0 0 280 280" width="280" height="280" style={{ display: "block" }}>
          <defs>
            <radialGradient id="moonSurface" cx="40%" cy="36%" r="62%">
              <stop offset="0%"   stopColor="hsl(214 32% 38%)" />
              <stop offset="35%"  stopColor="hsl(220 40% 26%)" />
              <stop offset="75%"  stopColor="hsl(224 46% 18%)" />
              <stop offset="100%" stopColor="hsl(228 54% 11%)" />
            </radialGradient>
            <radialGradient id="moonShimmer" cx="34%" cy="30%" r="38%">
              <stop offset="0%"   stopColor="hsl(210 55% 78%)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="hsl(210 55% 78%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moonRim" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(200 78% 66%)" stopOpacity="0.22" />
            </radialGradient>
            <radialGradient id="moonLimb" cx="72%" cy="50%" r="38%">
              <stop offset="0%"   stopColor="hsl(228 60% 6%)" stopOpacity="0.50" />
              <stop offset="100%" stopColor="hsl(228 60% 6%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base disc */}
          <circle cx="140" cy="140" r="128" fill="hsl(228 54% 10%)" />
          {/* Surface */}
          <circle cx="140" cy="140" r="128" fill="url(#moonSurface)" />
          {/* Limb darkening */}
          <circle cx="140" cy="140" r="128" fill="url(#moonLimb)" />

          {/* Maria */}
          <ellipse cx="116" cy="120" rx="34" ry="26" fill="hsl(226 48% 14%)" opacity="0.38" />
          <ellipse cx="170" cy="160" rx="26" ry="20" fill="hsl(226 48% 14%)" opacity="0.30" />
          <ellipse cx="94"  cy="172" rx="20" ry="15" fill="hsl(226 48% 14%)" opacity="0.25" />

          {/* Craters */}
          <circle cx="102" cy="116" r="18" fill="hsl(228 52% 8%)" opacity="0.55" />
          <circle cx="102" cy="116" r="18" fill="none" stroke="hsl(216 36% 30%)" strokeWidth="1" opacity="0.40" />

          <circle cx="180" cy="158" r="13" fill="hsl(228 52% 8%)" opacity="0.45" />
          <circle cx="180" cy="158" r="13" fill="none" stroke="hsl(216 36% 30%)" strokeWidth="0.8" opacity="0.30" />

          <circle cx="120" cy="192" r="22" fill="hsl(228 52% 8%)" opacity="0.50" />
          <circle cx="120" cy="192" r="22" fill="none" stroke="hsl(216 36% 30%)" strokeWidth="1" opacity="0.35" />

          <circle cx="200" cy="94"  r="14" fill="hsl(228 52% 8%)" opacity="0.40" />
          <circle cx="200" cy="94"  r="14" fill="none" stroke="hsl(216 36% 30%)" strokeWidth="0.8" opacity="0.28" />

          <circle cx="76"  cy="178" r="9"  fill="hsl(228 52% 8%)" opacity="0.38" />
          <circle cx="164" cy="86"  r="7"  fill="hsl(228 52% 8%)" opacity="0.32" />
          <circle cx="216" cy="150" r="10" fill="hsl(228 52% 8%)" opacity="0.35" />

          {/* Specular shimmer + rim */}
          <circle cx="140" cy="140" r="128" fill="url(#moonShimmer)" />
          <circle cx="140" cy="140" r="128" fill="url(#moonRim)" />
          <circle cx="140" cy="140" r="128" fill="none" stroke="hsl(200 75% 65%)" strokeWidth="1.4" opacity="0.18" />
        </svg>
      </div>

      {/* ── Rocket — bottom-left, flies to top-right ─────── */}
      {/*
        Container anchored at bottom-left within the section.
        The rocket assembly is tilted 38 deg so the nose points upper-right.
        animate-rocket-diagonal translates it across the screen on a 20 s loop.
        z-index 1 keeps it firmly behind all hero text (z-10).
      */}
      <div
        style={{
          position: "absolute",
          left: "4%",
          bottom: "6%",
          zIndex: 1,
        }}
      >
        <div className="animate-rocket-diagonal">
          {/* Static tilt — nose points upper-right */}
          <div style={{ transform: "rotate(38deg)", transformOrigin: "center center" }}>

            {/* ── Rocket body ── */}
            <svg
              viewBox="-24 -68 48 136"
              width="160"
              height="320"
              style={{
                display: "block",
                filter:
                  "drop-shadow(0 0 16px hsl(200 80% 70% / 0.70)) " +
                  "drop-shadow(0 0 50px hsl(200 80% 70% / 0.30))",
              }}
            >
              <defs>
                <radialGradient id="rBody" cx="35%" cy="30%" r="60%">
                  <stop offset="0%"   stopColor="hsl(218 50% 34%)" />
                  <stop offset="100%" stopColor="hsl(224 56% 18%)" />
                </radialGradient>
              </defs>

              {/* Body */}
              <path
                d="M0,-64 C12,-48 16,-12 16,24 C16,34 10,38 0,38 C-10,38 -16,34 -16,24 C-16,-12 -12,-48 0,-64 Z"
                fill="url(#rBody)"
              />
              {/* Body sheen left */}
              <path
                d="M-5,-62 C4,-46 8,-12 8,18 C8,30 4,36 0,38"
                stroke="hsl(200 80% 72%)"
                strokeWidth="1.6"
                fill="none"
                opacity="0.55"
              />
              {/* Body sheen right (faint) */}
              <path
                d="M-12,-50 C-10,-28 -10,0 -10,14"
                stroke="hsl(200 80% 72%)"
                strokeWidth="0.7"
                fill="none"
                opacity="0.20"
              />

              {/* Nose cone — brand accent blue */}
              <path
                d="M0,-64 C6,-52 8,-34 8,-20 C8,-15 4.5,-13 0,-13 C-4.5,-13 -8,-15 -8,-20 C-8,-34 -6,-52 0,-64 Z"
                fill="hsl(200 82% 70%)"
              />
              {/* Nose specular */}
              <path
                d="M0,-64 C2.5,-56 3,-48 3,-40"
                stroke="hsl(0 0% 100%)"
                strokeWidth="1.1"
                fill="none"
                opacity="0.28"
              />

              {/* Porthole */}
              <circle cx="0" cy="8"  r="10.5" fill="hsl(222 62% 7%)" />
              <circle cx="0" cy="8"  r="9"    fill="hsl(204 60% 13%)" />
              <circle cx="0" cy="8"  r="7.5"  fill="hsl(208 64% 17%)" />
              <circle cx="-3" cy="5" r="3"    fill="hsl(200 80% 92%)" opacity="0.18" />
              <circle cx="0" cy="8"  r="10.5" fill="none" stroke="hsl(200 70% 55%)" strokeWidth="0.9" opacity="0.35" />

              {/* Left fin */}
              <path d="M-16,20 L-30,46 L-16,36 Z" fill="hsl(202 65% 38%)" />
              <path d="M-16,20 L-30,46" stroke="hsl(200 80% 62%)" strokeWidth="0.9" opacity="0.40" />
              {/* Right fin */}
              <path d="M16,20 L30,46 L16,36 Z"   fill="hsl(202 65% 38%)" />
              <path d="M16,20 L30,46"  stroke="hsl(200 80% 62%)" strokeWidth="0.9" opacity="0.40" />

              {/* Nozzle */}
              <rect x="-10" y="38" width="20" height="8"  rx="3" fill="hsl(222 40% 16%)" />
              <rect x="-10" y="38" width="20" height="2.5" rx="0" fill="hsl(222 40% 30%)" />
              <rect x="-10" y="43" width="20" height="3"  rx="0" fill="hsl(222 40% 12%)" />
            </svg>

            {/* ── Flame ── */}
            <div
              className="animate-flame"
              style={{
                marginTop: "-8px",
                display: "flex",
                justifyContent: "center",
                transformOrigin: "center top",
              }}
            >
              <svg
                viewBox="-14 0 28 52"
                width="52"
                height="88"
                style={{
                  display: "block",
                  filter: "drop-shadow(0 0 12px hsl(42 90% 55% / 0.95))",
                }}
              >
                <path d="M-12,0 Q-8,28 0,48 Q8,28 12,0 Z"   fill="hsl(42 90% 55%)"  opacity="0.96" />
                <path d="M-7.5,0 Q-5,20 0,36 Q5,20 7.5,0 Z" fill="hsl(28 100% 64%)" opacity="0.86" />
                <path d="M-4,0 Q-2.5,12 0,22 Q2.5,12 4,0 Z" fill="hsl(55 100% 88%)" opacity="0.92" />
              </svg>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
