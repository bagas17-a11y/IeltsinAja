import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "How accurate is the AI feedback compared to real examiners?",
    answer:
      "Our AI models are trained on thousands of examiner-graded essays and have been validated to match examiner scoring within 0.5 bands in 94% of cases. However, for nuanced feedback on coherence and task achievement, we always recommend combining AI insights with our human consultation sessions.",
  },
  {
    question: "What qualifications do your consultants have?",
    answer:
      "All our consultants are former IELTS examiners with a minimum of 5 years examining experience. They've collectively assessed over 100,000 candidates and hold advanced degrees in linguistics, education, or related fields. Each consultant undergoes our rigorous internal certification process.",
  },
  {
    question: "Can I switch between plans at any time?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any point. When upgrading, you'll get immediate access to new features. When downgrading, your current plan benefits continue until the end of your billing cycle. All your progress and data is preserved across plan changes.",
  },
  {
    question: "How quickly will I see improvement in my scores?",
    answer:
      "Most students see measurable improvement within 4-6 weeks of consistent practice. Our data shows that students who complete at least 3 practice sessions per week and attend regular consultation sessions improve by an average of 1.0 band score within 8 weeks.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes. We offer a 14-day money-back guarantee on all plans. If you're not satisfied with the platform for any reason within the first 14 days, we'll provide a full refund—no questions asked. For Elite plan members, we also offer a score improvement guarantee.",
  },
  {
    question: "What makes IELTS Elite different from other prep platforms?",
    answer:
      "We're the only platform that combines enterprise-grade AI technology with access to actual former examiners. While other platforms offer either AI-only or human-only approaches, we've built a hybrid system where AI handles the practice and analytics while humans provide the strategic insights that push you past scoring plateaus.",
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
          {/* Section Header */}
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg">
              Everything you need to know about our platform and process.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`glass-card border-none overflow-hidden transition-all duration-500 ${
                  isRevealed
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
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
        </div>
      </div>
    </section>
  );
};
