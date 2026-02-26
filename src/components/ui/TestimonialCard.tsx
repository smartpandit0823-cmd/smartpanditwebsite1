import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="glass-surface flex h-full flex-col rounded-2xl border border-saffron-200/70 p-5 shadow-sm">
      <Quote className="text-saffron-300" size={30} />
      <p className="line-clamp-4 mt-2 flex-1 text-sm text-warm-700">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < testimonial.rating ? "fill-gold-400 text-gold-400" : "text-warm-300"}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-saffron-100 text-xs font-semibold text-saffron-700">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-warm-900">{testimonial.name}</p>
          <p className="text-xs text-warm-600">{testimonial.location}</p>
        </div>
      </div>
    </article>
  );
}
