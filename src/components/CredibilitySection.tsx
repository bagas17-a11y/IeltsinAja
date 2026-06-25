const founderUniversities = [
  { name: "UC Berkeley", logo: "/assets/berkeley-logo.png", bg: "bg-[#003262]" },
  { name: "UCLA", logo: "/assets/ucla-logo.png", bg: "bg-[#2774AE]" },
];

const destinations = [
  {
    region: "United States",
    flag: "🇺🇸",
    color: "from-blue-900/40 to-red-900/20 border-blue-500/20",
    accent: "text-blue-400",
    universities: ["Harvard", "MIT", "Stanford", "Columbia", "UC Berkeley", "UCLA"],
  },
  {
    region: "United Kingdom",
    flag: "🇬🇧",
    color: "from-blue-900/40 to-indigo-900/20 border-indigo-500/20",
    accent: "text-indigo-400",
    universities: ["Oxford", "Cambridge", "Imperial College", "UCL", "LSE", "Edinburgh"],
  },
  {
    region: "Singapore",
    flag: "🇸🇬",
    color: "from-red-900/30 to-zinc-900/20 border-red-500/20",
    accent: "text-red-400",
    universities: ["NUS", "NTU", "SMU", "SUTD"],
  },
  {
    region: "Europe",
    flag: "🇪🇺",
    color: "from-yellow-900/20 to-zinc-900/20 border-yellow-500/15",
    accent: "text-yellow-400",
    universities: ["Sciences Po", "TU Delft", "Erasmus", "LMU Munich", "University of Amsterdam"],
  },
];

const specialPaths = [
  { label: "IUP Programmes", desc: "International Undergraduate Programs at top Indonesian universities", icon: "🏛️" },
  { label: "Master's Degrees", desc: "Postgraduate study at ranked global universities", icon: "🎓" },
  { label: "Scholarships", desc: "LPDP, Chevening, Fulbright, and other funded programmes", icon: "🏅" },
];

export const CredibilitySection = () => {
  return (
    <section className="py-20 bg-background border-t border-border/30">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Founder credibility */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em] mb-3">
            Founded by alumni of
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {founderUniversities.map((u) => (
              <div key={u.name} className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full ${u.bg} flex items-center justify-center overflow-hidden p-1.5 border border-white/10`}>
                  <img src={u.logo} alt={u.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{u.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Built for students with{" "}
            <span className="text-gradient">global ambitions</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you're targeting a top-ranked university abroad, an IUP programme, or a fully-funded scholarship — IELTS is your first step. We help you clear it with confidence.
          </p>
        </div>

        {/* Destination cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {destinations.map((d) => (
            <div
              key={d.region}
              className={`rounded-xl bg-gradient-to-br ${d.color} border p-5`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{d.flag}</span>
                <p className={`text-sm font-semibold ${d.accent}`}>{d.region}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {d.universities.map((uni) => (
                  <span
                    key={uni}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-foreground/60"
                  >
                    {uni}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special paths strip */}
        <div className="grid gap-3 sm:grid-cols-3">
          {specialPaths.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4"
            >
              <span className="text-xl shrink-0">{p.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">{p.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
