import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpiritualBadgeProps {
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export function SpiritualBadge({ label, size = "sm", className }: SpiritualBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-saffron-100 text-saffron-700",
        size === "sm" && "px-2 py-0.5 text-xs font-medium",
        size === "md" && "px-3 py-1 text-sm font-medium",
        className
      )}
    >
      <Shield size={14} strokeWidth={2.5} />
      {label}
    </span>
  );
}
