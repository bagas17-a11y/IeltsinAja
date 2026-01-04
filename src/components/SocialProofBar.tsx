export const SocialProofBar = () => {
  const logos = [
    { name: "British Council", short: "BC" },
    { name: "IDP Education", short: "IDP" },
    { name: "Cambridge", short: "CAM" },
    { name: "ETS Global", short: "ETS" },
    { name: "Education First", short: "EF" },
  ];

  return (
    <section className="py-12 border-y border-border/50 bg-secondary/20">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8 tracking-wide uppercase">
          Trusted by leading education institutions
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className="group flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center border border-border/50">
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {logo.short}
                </span>
              </div>
              <span className="text-sm font-light text-muted-foreground group-hover:text-foreground transition-colors hidden md:block">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
