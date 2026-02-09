"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";

import { RichText } from "../elements/rich-text";

interface TextBlockProps {
  title?: string | null;
  richText?: any;
  alignment?: "left" | "center" | "right" | null;
}

export function TextBlock({ title, richText, alignment }: TextBlockProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  const alignmentClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
        ? "text-right"
        : "text-left";

  return (
    <section ref={ref} className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {title && (
            <h1
              className={`text-3xl font-semibold md:text-4xl mb-8 ${alignmentClass}`}
            >
              {title}
            </h1>
          )}
          <RichText
            richText={richText}
            alignment={alignment as "left" | "center" | "right"}
          />
        </div>
      </div>
    </section>
  );
}
