import { Instagram, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { buildWhatsAppLink, CONTACT_MESSAGES, OPERATOR } from "@/lib/contact";

const productLinks = [
  { label: "Reading practice", href: "/auth?mode=signup" },
  { label: "Listening practice", href: "/auth?mode=signup" },
  { label: "Writing practice", href: "/auth?mode=signup" },
  { label: "Speaking practice", href: "/auth?mode=signup" },
];

const supportLinks: Array<{ label: string; href: string; isRoute?: boolean; external?: boolean }> = [
  { label: "WhatsApp support", href: buildWhatsAppLink(CONTACT_MESSAGES.generalHelp), external: true },
  { label: "FAQ", href: "/#faq" },
  { label: "Privacy Policy", href: "/privacy-policy", isRoute: true },
  { label: "Terms of Service", href: "/terms-of-service", isRoute: true },
];

export const Footer = () => {
  return (
    <footer className="py-16 md:py-20 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="text-2xl font-light tracking-tight text-foreground inline-block mb-4">
              Eng<span className="text-accent font-medium">InAja</span>
            </a>
            <p className="text-foreground/60 max-w-sm mb-6">
              AI-powered IELTS preparation built for Indonesian learners. Currently in pilot.
            </p>
            <p className="text-xs text-muted-foreground">
              {OPERATOR.name}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-foreground/60 hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Mumpune. Independent IELTS prep — not affiliated with British Council, IDP, or Cambridge.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.instagram.com/${OPERATOR.instagramHandle}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={buildWhatsAppLink(CONTACT_MESSAGES.generalHelp)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@eng-inaja.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
