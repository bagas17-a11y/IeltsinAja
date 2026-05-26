import { Star } from "lucide-react";

interface Review {
  name: string;
  avatar: string;
  rating: number;
  text: string;
  detail: string;
}

const REVIEWS: Review[] = [
  {
    name: "Aditya R.",
    avatar: "AR",
    rating: 5,
    text: "Ga nyangka sih bisa naik dari 6.0 ke 7.5 dalam 2 bulan. Honestly worth it banget!",
    detail: "Writing & Speaking · Pro Plan",
  },
  {
    name: "Sarah M.",
    avatar: "SM",
    rating: 5,
    text: "The AI feedback on my essays is incredibly detailed. It's like having a private tutor available 24/7.",
    detail: "Writing · Pro Plan",
  },
  {
    name: "Rizky F.",
    avatar: "RF",
    rating: 5,
    text: "AI feedback-nya accurate parah, kayak real IELTS examiner gitu. Udah nyoba platform lain tapi ini yang paling helpful.",
    detail: "All modules · Pro Plan",
  },
  {
    name: "Clarissa T.",
    avatar: "CT",
    rating: 5,
    text: "Finally hit Band 7! The reading practice tests feel just like the real exam. Super recommended buat yang mau improve fast.",
    detail: "Reading · Pro Plan",
  },
  {
    name: "Bagas P.",
    avatar: "BP",
    rating: 5,
    text: "Coach-nya dari Elite plan beneran helpful, langsung tau weak point gue di grammar. Score gue naik 1 full band in 6 weeks.",
    detail: "Elite Plan · 1-on-1 Coaching",
  },
  {
    name: "Natasha W.",
    avatar: "NW",
    rating: 5,
    text: "Suka banget sama speaking practice-nya. Bisa latihan kapan aja tanpa malu salah di depan orang, lol. Great product!",
    detail: "Speaking · Pro Plan",
  },
  {
    name: "Kevin L.",
    avatar: "KL",
    rating: 5,
    text: "The progress dashboard keeps me motivated. I can literally see myself improving week by week. 10/10 would recommend.",
    detail: "All modules · Pro Plan",
  },
  {
    name: "Dinda S.",
    avatar: "DS",
    rating: 5,
    text: "Listening-nya paling suka, soalnya bisa diulang-ulang dan ada penjelasan per soal. Jauh lebih enak dari belajar sendiri.",
    detail: "Listening · Pro Plan",
  },
  {
    name: "James O.",
    avatar: "JO",
    rating: 5,
    text: "Went from 6.5 to 8.0 in the writing section. The model answers and band-score breakdown are a game changer.",
    detail: "Writing · Elite Plan",
  },
];

const StarRow = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < count ? "fill-elite-gold text-elite-gold" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="glass-card p-5 flex flex-col gap-3 border-border/50">
    <StarRow count={review.rating} />
    <p className="text-sm text-foreground/80 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
    <div className="flex items-center gap-2.5 mt-auto pt-2 border-t border-border/30">
      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent flex-shrink-0">
        {review.avatar}
      </div>
      <div>
        <p className="text-xs font-medium text-foreground">{review.name}</p>
        <p className="text-[10px] text-muted-foreground">{review.detail}</p>
      </div>
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const col1 = REVIEWS.filter((_, i) => i % 3 === 0);
  const col2 = REVIEWS.filter((_, i) => i % 3 === 1);
  const col3 = REVIEWS.filter((_, i) => i % 3 === 2);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm text-accent font-medium tracking-wide uppercase mb-3">Student Reviews</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
            Real results from <span className="text-gradient">real students</span>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto text-foreground/70">
            From Band 6 to Band 8 — here's what students are saying.
          </p>
        </div>

        {/* Masonry grid — 3 columns on md+, 1 on mobile */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <div className="flex flex-col gap-4">
            {col1.map((r) => <ReviewCard key={r.name} review={r} />)}
          </div>
          <div className="flex flex-col gap-4 md:mt-6">
            {col2.map((r) => <ReviewCard key={r.name} review={r} />)}
          </div>
          <div className="flex flex-col gap-4">
            {col3.map((r) => <ReviewCard key={r.name} review={r} />)}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex flex-col gap-4 md:hidden max-w-lg mx-auto">
          {REVIEWS.map((r) => <ReviewCard key={r.name} review={r} />)}
        </div>

        {/* Aggregate score */}
        <div className="text-center mt-12 flex items-center justify-center gap-3">
          <StarRow count={5} />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">4.9 / 5</span> · Based on student feedback
          </p>
        </div>
      </div>
    </section>
  );
};
