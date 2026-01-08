import { Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  product: [{
    label: "Reading Engine",
    href: "#reading"
  }, {
    label: "Listening Lab",
    href: "#listening"
  }, {
    label: "Writing Suite",
    href: "#writing"
  }, {
    label: "Consultation",
    href: "#consultation"
  }],
  support: [{
    label: "Help Center",
    href: "#"
  }, {
    label: "Privacy Policy",
    href: "/privacy-policy",
    isRoute: true
  }, {
    label: "Terms of Service",
    href: "/terms-of-service",
    isRoute: true
  }]
};
const socialLinks = [{
  icon: Linkedin,
  href: "#",
  label: "LinkedIn"
}, {
  icon: Instagram,
  href: "https://www.instagram.com/ieltsinaja/",
  deepLink: "instagram://user?username=ieltsinaja",
  label: "Instagram",
  external: true
}];
export const Footer = () => {
  return <footer className="py-16 md:py-20 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#" className="text-2xl font-light tracking-tight text-foreground inline-block mb-4">
              IELTS<span className="text-accent font-medium">inAja</span>
            </a>
            <p className="text-foreground/60 max-w-sm mb-6">The intelligence to Simplify. The guidance to IELTSinAja. Your pathway to Band 9 excellence.</p>
            <p className="text-sm text-muted-foreground italic">
              Designed for Excellence
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map(link => <li key={link.label}>
                  <a href={link.href} className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Company Links */}
          

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => <li key={link.label}>
                  {(link as any).isRoute ? (
                    <Link to={link.href} className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                      {link.label}
                    </a>
                  )}
                </li>)}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
          

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(social => {
            const Icon = social.icon;
            const handleClick = (e: React.MouseEvent) => {
              if ((social as any).deepLink) {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                  e.preventDefault();
                  window.location.href = (social as any).deepLink;
                  setTimeout(() => {
                    window.open(social.href, '_blank', 'noopener,noreferrer');
                  }, 500);
                }
              }
            };
            return <a 
              key={social.label} 
              href={social.href} 
              aria-label={social.label} 
              target={(social as any).external ? "_blank" : undefined}
              rel={(social as any).external ? "noopener noreferrer" : undefined}
              onClick={handleClick}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            >
                  <Icon className="w-4 h-4" />
                </a>;
          })}
          </div>
        </div>
      </div>
    </footer>;
};