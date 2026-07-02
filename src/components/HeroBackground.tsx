const STARS = [
  { l: "4%",  t: "7%",  s: "1px",   o: 0.55, d: "0s",   dr: "3.2s" },
  { l: "11%", t: "23%", s: "1.5px", o: 0.40, d: "1.1s", dr: "2.6s" },
  { l: "18%", t: "14%", s: "1px",   o: 0.70, d: "0.4s", dr: "3.8s" },
  { l: "26%", t: "8%",  s: "2px",   o: 0.30, d: "2.3s", dr: "2.9s" },
  { l: "33%", t: "18%", s: "1px",   o: 0.60, d: "0.7s", dr: "4.1s" },
  { l: "41%", t: "5%",  s: "1.5px", o: 0.45, d: "1.8s", dr: "3.0s" },
  { l: "55%", t: "12%", s: "2px",   o: 0.65, d: "0.2s", dr: "3.5s" },
  { l: "70%", t: "9%",  s: "1.5px", o: 0.40, d: "2.8s", dr: "2.8s" },
  { l: "77%", t: "20%", s: "1px",   o: 0.60, d: "0.9s", dr: "3.6s" },
  { l: "84%", t: "6%",  s: "2px",   o: 0.35, d: "3.5s", dr: "2.2s" },
  { l: "8%",  t: "38%", s: "1px",   o: 0.55, d: "2.1s", dr: "2.7s" },
  { l: "15%", t: "30%", s: "1.5px", o: 0.30, d: "4.0s", dr: "3.9s" },
  { l: "22%", t: "42%", s: "1px",   o: 0.50, d: "0.5s", dr: "2.5s" },
  { l: "48%", t: "28%", s: "1.5px", o: 0.35, d: "3.2s", dr: "3.1s" },
  { l: "59%", t: "35%", s: "1px",   o: 0.45, d: "0.7s", dr: "4.2s" },
  { l: "67%", t: "15%", s: "1px",   o: 0.70, d: "3.8s", dr: "2.6s" },
  { l: "3%",  t: "52%", s: "1px",   o: 0.30, d: "1.4s", dr: "3.2s" },
  { l: "20%", t: "58%", s: "1.5px", o: 0.25, d: "2.6s", dr: "3.3s" },
  { l: "39%", t: "45%", s: "1px",   o: 0.35, d: "0.8s", dr: "2.3s" },
];

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>

      {/* ── Night sky → dawn horizon → ocean gradient ── */}
      <div className="absolute inset-0" style={{
        background:
          "linear-gradient(180deg, #0B0F1C 0%, #0D1628 18%, #0A2040 34%, #0D3860 50%, #1A6888 63%, #3A9ABE 68%, #6ECEF5 73%, #F5803A 79%, #1C2840 87%, #0A1828 93%, #060C18 100%)",
      }} />

      {/* ── Star field (upper night sky) ── */}
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

      {/* ── Moon — upper-right ── */}
      <div
        className="animate-moon-glow absolute"
        style={{ top: "4%", right: "4%", zIndex: 2 }}
      >
        {/* Outer halo */}
        <div style={{
          position: "absolute", inset: "-70px", borderRadius: "50%",
          background: "radial-gradient(circle, hsl(200 80% 70% / 0.08) 35%, transparent 70%)",
          filter: "blur(35px)",
        }} />
        {/* Mid halo */}
        <div style={{
          position: "absolute", inset: "-25px", borderRadius: "50%",
          background: "hsl(200 75% 65% / 0.05)",
          filter: "blur(18px)",
        }} />

        <svg viewBox="0 0 280 280" width="240" height="240" style={{ display: "block" }}>
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
            <filter id="cloudBlur"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>

          {/* Moon disc */}
          <circle cx="140" cy="140" r="128" fill="hsl(228 54% 10%)" />
          <circle cx="140" cy="140" r="128" fill="url(#moonSurface)" />
          <circle cx="140" cy="140" r="128" fill="url(#moonLimb)" />

          {/* Maria */}
          <ellipse cx="116" cy="120" rx="34" ry="26" fill="hsl(226 48% 14%)" opacity="0.38" />
          <ellipse cx="170" cy="160" rx="26" ry="20" fill="hsl(226 48% 14%)" opacity="0.30" />

          {/* Craters */}
          <circle cx="102" cy="116" r="18" fill="hsl(228 52% 8%)" opacity="0.55" />
          <circle cx="102" cy="116" r="18" fill="none" stroke="hsl(216 36% 30%)" strokeWidth="1" opacity="0.40" />
          <circle cx="180" cy="158" r="13" fill="hsl(228 52% 8%)" opacity="0.45" />
          <circle cx="120" cy="192" r="22" fill="hsl(228 52% 8%)" opacity="0.50" />
          <circle cx="200" cy="94"  r="14" fill="hsl(228 52% 8%)" opacity="0.40" />

          {/* Specular shimmer + rim */}
          <circle cx="140" cy="140" r="128" fill="url(#moonShimmer)" />
          <circle cx="140" cy="140" r="128" fill="url(#moonRim)" />
          <circle cx="140" cy="140" r="128" fill="none" stroke="hsl(200 75% 65%)" strokeWidth="1.4" opacity="0.18" />

          {/* Thin cloud veil across moon */}
          <path
            d="M20,100 Q60,78 110,85 Q150,72 195,82 Q230,76 260,95"
            stroke="rgba(160,200,235,0.30)"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            filter="url(#cloudBlur)"
          />
          <path
            d="M15,118 Q55,102 100,108 Q145,96 185,105 Q218,98 255,112"
            stroke="rgba(140,185,225,0.18)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            filter="url(#cloudBlur)"
          />
        </svg>
      </div>

      {/* ── Horizon warm glow ── */}
      <div className="absolute" style={{
        top: "70%", left: "50%", transform: "translateX(-50%) translateY(-50%)",
        width: "900px", height: "250px",
        background: "radial-gradient(ellipse at center, rgba(245,128,58,0.50) 0%, rgba(110,206,245,0.20) 45%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* ── Moonlight reflection on water ── */}
      <div className="absolute" style={{
        top: "72%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90px",
        bottom: 0,
        background: "linear-gradient(180deg, rgba(110,206,245,0.45) 0%, rgba(110,206,245,0.12) 50%, transparent 100%)",
        filter: "blur(14px)",
      }} />
      {/* Wider softer glow beneath */}
      <div className="absolute" style={{
        top: "74%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "260px",
        bottom: 0,
        background: "linear-gradient(180deg, rgba(110,206,245,0.12) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      {/* ── Ocean waves ── */}
      {/* Ocean base fill */}
      <div className="absolute" style={{
        top: "72%", left: 0, right: 0, bottom: 0,
        background: "linear-gradient(180deg, transparent 0%, #091422 18%, #060C18 60%, #040810 100%)",
      }} />

      {/* Wave shapes */}
      <svg className="absolute w-full" style={{ top: "70%", height: "18%", opacity: 0.9 }}
           viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,60 C180,42 360,75 540,54 C720,33 900,68 1080,50 C1260,32 1380,62 1440,52 L1440,120 L0,120 Z"
          fill="rgba(8,20,38,0.85)"
        />
      </svg>
      <svg className="absolute w-full" style={{ top: "74%", height: "14%", opacity: 0.95 }}
           viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path
          d="M0,48 C150,32 300,58 450,42 C600,26 750,54 900,40 C1050,26 1200,50 1440,38 L1440,100 L0,100 Z"
          fill="rgba(6,14,28,0.90)"
        />
      </svg>

      {/* Subtle wave surface lines */}
      <svg className="absolute w-full" style={{ top: "72%", height: "10%" }}
           viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path
          d="M0,12 C120,8 240,16 360,10 C480,4 600,14 720,8 C840,2 960,12 1080,7 C1200,2 1320,11 1440,7"
          fill="none" stroke="rgba(110,206,245,0.10)" strokeWidth="1.5"
        />
        <path
          d="M0,24 C100,19 220,28 340,22 C460,16 580,26 700,20 C820,14 940,24 1060,18 C1180,12 1300,22 1440,17"
          fill="none" stroke="rgba(110,206,245,0.07)" strokeWidth="1"
        />
        <path
          d="M0,36 C140,30 280,40 420,33 C560,26 700,38 840,31 C980,24 1120,36 1260,29 C1340,25 1400,33 1440,30"
          fill="none" stroke="rgba(110,206,245,0.05)" strokeWidth="0.8"
        />
      </svg>

      {/* ── Rocket — bottom-left, flies to top-right ── */}
      <div style={{ position: "absolute", left: "4%", bottom: "6%", zIndex: 1 }}>
        <div className="animate-rocket-diagonal">
          <div style={{ transform: "rotate(38deg)", transformOrigin: "center center" }}>
            <svg
              viewBox="-24 -68 48 136"
              width="140"
              height="280"
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
              <path
                d="M0,-64 C12,-48 16,-12 16,24 C16,34 10,38 0,38 C-10,38 -16,34 -16,24 C-16,-12 -12,-48 0,-64 Z"
                fill="url(#rBody)"
              />
              <path d="M-5,-62 C4,-46 8,-12 8,18 C8,30 4,36 0,38" stroke="hsl(200 80% 72%)" strokeWidth="1.6" fill="none" opacity="0.55" />
              <path d="M0,-64 C6,-52 8,-34 8,-20 C8,-15 4.5,-13 0,-13 C-4.5,-13 -8,-15 -8,-20 C-8,-34 -6,-52 0,-64 Z" fill="hsl(200 82% 70%)" />
              <path d="M0,-64 C2.5,-56 3,-48 3,-40" stroke="hsl(0 0% 100%)" strokeWidth="1.1" fill="none" opacity="0.28" />
              <circle cx="0" cy="8"  r="10.5" fill="hsl(222 62% 7%)" />
              <circle cx="0" cy="8"  r="9"    fill="hsl(204 60% 13%)" />
              <circle cx="0" cy="8"  r="7.5"  fill="hsl(208 64% 17%)" />
              <circle cx="-3" cy="5" r="3"    fill="hsl(200 80% 92%)" opacity="0.18" />
              <path d="M-16,20 L-30,46 L-16,36 Z" fill="hsl(202 65% 38%)" />
              <path d="M16,20 L30,46 L16,36 Z"   fill="hsl(202 65% 38%)" />
              <rect x="-10" y="38" width="20" height="8" rx="3" fill="hsl(222 40% 16%)" />
            </svg>
            <div className="animate-flame" style={{ marginTop: "-8px", display: "flex", justifyContent: "center", transformOrigin: "center top" }}>
              <svg viewBox="-14 0 28 52" width="46" height="78" style={{ display: "block", filter: "drop-shadow(0 0 12px hsl(42 90% 55% / 0.95))" }}>
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
