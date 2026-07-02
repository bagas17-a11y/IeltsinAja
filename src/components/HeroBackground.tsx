export const HeroBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

    {/* Sky gradient — white at top, warm sunrise in the lower half */}
    <div className="absolute inset-0" style={{
      background:
        "linear-gradient(180deg, #ffffff 0%, #eef7ff 8%, #d8eeff 18%, #a8d4f5 32%, #60a8e0 48%, #e07850 68%, #f4b242 83%, #f8d882 93%, #fde8b0 100%)",
    }} />

    {/* Horizon bloom — warm sun glow behind mountains */}
    <div className="absolute" style={{
      bottom: "22%", left: "50%", transform: "translateX(-50%)",
      width: "800px", height: "420px",
      background:
        "radial-gradient(ellipse at center, rgba(255,195,80,0.60) 0%, rgba(255,110,40,0.30) 40%, transparent 68%)",
      filter: "blur(52px)",
    }} />

    {/* Atmospheric haze above mountains */}
    <div className="absolute" style={{
      bottom: "30%", left: "50%", transform: "translateX(-50%)",
      width: "1100px", height: "300px",
      background: "radial-gradient(ellipse at center, rgba(255,215,120,0.14) 0%, transparent 60%)",
      filter: "blur(30px)",
    }} />

    {/* Far mountains — misty blue range */}
    <svg
      className="absolute w-full"
      style={{ bottom: "28%", height: "38%" }}
      viewBox="0 0 1440 350"
      preserveAspectRatio="none"
    >
      <path
        d="M0,350 L0,185 C60,168 120,202 200,168 C280,134 342,182 422,148
           C502,114 562,166 642,130 C722,94 792,150 872,114
           C952,78 1012,134 1092,102 C1172,70 1242,120 1322,88
           C1382,64 1422,92 1440,82 L1440,350 Z"
        fill="rgba(80,130,200,0.25)"
      />
    </svg>

    {/* Mid mountains — deeper blue */}
    <svg
      className="absolute w-full"
      style={{ bottom: "16%", height: "42%" }}
      viewBox="0 0 1440 380"
      preserveAspectRatio="none"
    >
      <path
        d="M0,380 L0,238 C80,208 162,255 260,218 C358,181 442,230 540,194
           C638,158 722,210 820,174 C918,138 1002,192 1100,160
           C1198,128 1280,174 1362,148 C1402,136 1430,160 1440,148 L1440,380 Z"
        fill="rgba(20,55,130,0.55)"
      />
    </svg>

    {/* Near mountains — very dark foreground silhouette */}
    <svg
      className="absolute w-full"
      style={{ bottom: 0, height: "36%" }}
      viewBox="0 0 1440 340"
      preserveAspectRatio="none"
    >
      <path
        d="M0,340 L0,262 C100,230 192,277 302,246 C402,218 482,264 592,234
           C692,204 782,250 892,220 C992,190 1082,236 1182,210
           C1262,188 1342,224 1440,206 L1440,340 Z"
        fill="rgba(10,22,60,0.92)"
      />
    </svg>

  </div>
);
