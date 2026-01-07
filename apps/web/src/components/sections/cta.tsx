"use client";

import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

import { BackgroundPattern } from "../elements/background-pattern";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({ richText, title, eyebrow, buttons }: CTABlockProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section ref={ref} id="features" className="py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative bg-gradient-to-br from-primary to-primary/80 py-16 md:py-20 lg:py-24 rounded-3xl px-6 md:px-8 overflow-hidden">
          {/* Subtle dots pattern */}
          <BackgroundPattern
            pattern="dots"
            opacity={0.08}
            className="text-primary-foreground"
          />

          <div
            className={`relative z-10 text-center max-w-3xl mx-auto space-y-6 md:space-y-8 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {eyebrow && (
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium bg-primary-foreground/90 text-primary"
              >
                {eyebrow}
              </Badge>
            )}
            <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-balance text-primary-foreground">
              {title}
            </h2>
            <div className="text-base md:text-lg text-primary-foreground max-w-2xl mx-auto">
              <RichText
                richText={richText}
                className="text-primary-foreground text-center "
              />
            </div>
            <div className="flex justify-center pt-2">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-3 sm:grid-flow-col"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
