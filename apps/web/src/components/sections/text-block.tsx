"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";

import { RichText } from "../elements/rich-text";

interface TextBlockProps {
  title?: string | null;
  richText?: any;
  alignment?: "left" | "center" | "right" | null;
}

export function TextBlock({ title, richText, alignment }: TextBlockProps) {
  const { ref } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  const alignmentClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
        ? "text-right"
        : "text-left";

  return (
    <section ref={ref} className="field-light-section py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-primary/10 bg-white/35 p-6 opacity-100 shadow-sm backdrop-blur-sm transition-all duration-700 md:grid-cols-[0.8fr_1.2fr] md:p-10 lg:p-12">
          {title && (
            <h2
              className={`section-heading-compact ${alignmentClass}`}
            >
              {title}
            </h2>
          )}
          <div className="editorial-copy max-w-3xl">
            <RichText
              richText={richText}
              alignment={alignment as "left" | "center" | "right"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
