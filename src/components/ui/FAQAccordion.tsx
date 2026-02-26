"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQ } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQ[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="glass-surface overflow-hidden rounded-xl border border-saffron-200/60"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-4 text-left font-medium text-warm-900"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
            >
              {faq.question}
              <ChevronDown
                size={20}
                className={cn("shrink-0 text-warm-500 transition", isOpen && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-saffron-100 px-4 py-3 text-sm text-warm-700">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
