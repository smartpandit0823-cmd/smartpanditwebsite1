import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BannerSliderProps {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function BannerSlider({ items, className, itemClassName }: BannerSliderProps) {
  return (
    <div
      className={cn(
        "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn("min-w-[86%] snap-start sm:min-w-[340px] lg:min-w-[360px]", itemClassName)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
