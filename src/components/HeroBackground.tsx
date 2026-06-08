// Pre-computed to avoid render-time randomness
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

const SCORE_TRACK = [
  { label: "5.0", yPct: 85 },
  { label: "6.0", yPct: 64 },
  { label: "7.0", yPct: 43 },
  { label: "8.5", yPct: 22 },
];

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Drifting aurora orbs */}
      <div
        className="aurora-orb absolute rounded-full"
        style={{
          top: "15%", left: "55%",
          width: "450px", height: "450px",
          background: "hsl(200 80% 60% / 0.05)",
          filter: "blur(90px)",
          animationDelay: "0s",
        }}
      />
      <div
        className="aurora-orb absolute rounded-full"
        style={{
          top: "55%", left: "10%",
          width: "350px", height: "350px",
          background: "hsl(220 70% 45% / 0.07)",
          filter: "blur(70px)",
          animationDelay: "8s",
        }}
      />
      <div
        className="aurora-orb absolute rounded-full"
        style={{
          top: "30%", right: "5%",
          width: "400px", height: "400px",
          background: "hsl(200 90% 55% / 0.04)",
          filter: "blur(80px)",
          animationDelay: "4s",
        }}
      />

      {/* Star field */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="star absolute rounded-full bg-white"
          style={{
            left: star.l,
            top: star.t,
            width: star.s,
            height: star.s,
            opacity: star.o,
            animationDelay: star.d,
            animationDuration: star.dr,
          }}
        />
      ))}

      {/* Rocket launch column — right side */}
      <div
        className="absolute"
        style={{ right: "17%", bottom: "-12%" }}
      >
        {/* Vertical glow path the rocket travels */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "0",
            transform: "translateX(-50%)",
            width: "80px",
            height: "130vh",
            background: "linear-gradient(to top, hsl(200 80% 70% / 0.06) 0%, transparent 60%)",
            filter: "blur(20px)",
          }}
        />

        {/* Score ladder — faint band markers on the path */}
        {SCORE_TRACK.map((item) => (
          <div
            key={item.label}
            className="absolute flex items-center gap-1.5"
            style={{
              bottom: `${item.yPct}%`,
              right: "calc(100% + 10px)",
              opacity: item.yPct < 30 ? 0.75 : 0.28,
            }}
          >
            <div
              style={{
                width: item.yPct < 30 ? "16px" : "10px",
                height: "1px",
                background: "hsl(200 80% 70%)",
                opacity: 0.6,
              }}
            />
            <span
              style={{
                fontSize: "9px",
                fontWeight: 300,
                color: "hsl(200 80% 70%)",
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}

        {/* Rocket + flame, flying upward */}
        <div className="animate-rocket-soar flex flex-col items-center">
          {/* Rocket SVG */}
          <svg
            viewBox="-14 -44 28 88"
            width="44"
            height="88"
            style={{ filter: "drop-shadow(0 0 8px hsl(200 80% 70% / 0.5))" }}
          >
            {/* Main body */}
            <path
              d="M0,-40 C7,-28 9,-6 9,14 C9,19 6,21 0,21 C-6,21 -9,19 -9,14 C-9,-6 -7,-28 0,-40 Z"
              fill="hsl(220 55% 20%)"
            />
            {/* Body sheen */}
            <path
              d="M-2,-38 C3,-26 5,-6 5,10 C5,17 3,20 0,21"
              stroke="hsl(200 80% 70%)"
              strokeWidth="1.1"
              fill="none"
              opacity="0.55"
            />
            {/* Nose cone — accent color */}
            <path
              d="M0,-40 C3.5,-32 4.5,-20 4.5,-12 C4.5,-9 2.5,-7.5 0,-7.5 C-2.5,-7.5 -4.5,-9 -4.5,-12 C-4.5,-20 -3.5,-32 0,-40 Z"
              fill="hsl(200 80% 68%)"
            />
            {/* Porthole */}
            <circle cx="0" cy="4" r="5.5" fill="hsl(220 60% 8%)" />
            <circle cx="0" cy="4" r="4.5" fill="hsl(200 60% 14%)" />
            <circle cx="-1.5" cy="2.5" r="1.8" fill="hsl(200 80% 90%)" opacity="0.25" />
            {/* Left fin */}
            <path d="M-9,11 L-17,27 L-9,22 Z" fill="hsl(200 65% 38%)" />
            {/* Right fin */}
            <path d="M9,11 L17,27 L9,22 Z" fill="hsl(200 65% 38%)" />
            {/* Nozzle */}
            <rect x="-5.5" y="21" width="11" height="5" rx="1.5" fill="hsl(220 40% 18%)" />
            <rect x="-5.5" y="21" width="11" height="1.5" rx="0" fill="hsl(220 40% 28%)" />
          </svg>

          {/* Flame */}
          <div style={{ marginTop: "-3px" }}>
            <svg
              viewBox="-9 0 18 32"
              width="32"
              height="52"
              className="animate-flame"
              style={{ filter: "drop-shadow(0 0 6px hsl(42 90% 55% / 0.8))" }}
            >
              {/* Outer flame */}
              <path
                d="M-7,0 Q-5,18 0,28 Q5,18 7,0 Z"
                fill="hsl(42 90% 55%)"
                opacity="0.95"
              />
              {/* Mid flame */}
              <path
                d="M-4.5,0 Q-3,13 0,21 Q3,13 4.5,0 Z"
                fill="hsl(28 100% 65%)"
                opacity="0.85"
              />
              {/* Inner core */}
              <path
                d="M-2.5,0 Q-1.5,8 0,14 Q1.5,8 2.5,0 Z"
                fill="hsl(55 100% 88%)"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
