import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";
import { buildWhatsAppLink, CONTACT_MESSAGES } from "@/lib/contact";

const faqs = [
  {
    question: "Apa itu IELTSinAja? / What is IELTSinAja?",
    answer:
      "IELTSinAja is an AI-powered IELTS prep platform built for Indonesian learners. You can practice Reading, Listening, Writing, and Speaking with instant AI band-score feedback. The Elite plan adds live coaching with an 8.5+ scorer. We're in pilot, so prices and features are evolving — your feedback shapes the next version.",
  },
  {
    question: "How accurate is the AI feedback?",
    answer:
      "Our AI is calibrated against the official IELTS public band descriptors and uses GPT-class models to grade your work. Treat AI scores as a strong directional indicator (typically within ~0.5 bands of an examiner) — not an official IELTS result. For high-stakes feedback, upgrade to Elite and submit your essays for review by our 8.5+ scorer.",
  },
  {
    question: "How does payment work?",
    answer:
      "Free starts instantly. For Pro or Elite, after signup you'll open WhatsApp with a pre-filled message (your email + package). Pay and send proof there — we activate your account once we confirm on WhatsApp, usually within a few hours during Jakarta business hours. While you wait, you still get Free-tier practice on the dashboard.",
  },
  {
    question: "Can I switch plans or cancel later?",
    answer:
      "Yes. You can upgrade at any time. Pro is billed monthly so simply stop renewing to cancel. Elite is a one-time purchase — once your 5 coaching hours are used or 90 days pass, that's it. For partial refunds during the first 7 days, contact us on WhatsApp and we'll review case-by-case.",
  },
  {
    question: "Who is behind IELTSinAja?",
    answer:
      "IELTSinAja is built by Bagas (8.5 IELTS scorer) and a small team in Indonesia. We are not affiliated with British Council, IDP, or Cambridge. We are a pilot-stage indie product and we are honest about that — that's also why we keep WhatsApp as our primary support channel.",
  },
  {
    question: "Which browsers / devices are supported?",
    answer:
      "Reading, Listening, and Writing work on any modern browser (Chrome, Edge, Safari, Firefox) on desktop or mobile. Speaking practice uses your browser's speech recognition — for best results we recommend Chrome or Edge on desktop. iPhone Safari users can still type their answer if voice input is unavailable.",
  },
];

export const FAQSection = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-24 md:py-32 relative bg-secondary/20"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className={`text-center mb-12 md:mb-16 transition-opacity transition-transform duration-500 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              Frequently asked <span className="text-gradient">questions</span>
            </h2>
            <p className="text-lg">
              Straight answers from a small Indonesian team building IELTSinAja in
              public.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card border-none overflow-hidden"
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1), transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)`,
                  transitionDelay: `${80 + index * 50}ms`,
                }}
              >
                <AccordionTrigger className="px-6 py-5 text-left text-foreground hover:text-accent hover:no-underline transition-colors [&[data-state=open]>svg]:rotate-180">
                  <span className="font-light text-base md:text-lg">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-foreground/70 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div
            className="mt-10 text-center"
            style={{
              opacity: isRevealed ? 1 : 0,
              transition: "opacity 0.4s ease",
              transitionDelay: "400ms",
            }}
          >
            <p className="text-sm text-muted-foreground">
              Still have a question?{" "}
              <a
                href={buildWhatsAppLink(CONTACT_MESSAGES.generalHelp)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Chat with us on WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
