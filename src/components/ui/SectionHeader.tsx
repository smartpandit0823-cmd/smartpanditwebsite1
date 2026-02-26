interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div className={`divider-om mb-3 max-w-fit ${centered ? "mx-auto" : ""}`}>
        <span className="text-[1.5rem] leading-none">ॐ</span>
      </div>
      <h2 className="font-heading text-2xl font-bold text-warm-900 md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 max-w-xl text-warm-600 md:text-base ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
