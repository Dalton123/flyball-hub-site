"use client";

import { cn } from "@workspace/ui/lib/utils";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";

import { RichText } from "../elements/rich-text";
import { CTACard } from "../image-link-card";

export type ImageLinkCardsProps = PagebuilderType<"imageLinkCards">;

export function ImageLinkCards({
  richText,
  title,
  eyebrow,
  cards,
}: ImageLinkCardsProps) {
  const { ref } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section ref={ref} id="image-link-cards" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="grid w-full max-w-7xl gap-6 text-left opacity-100 transition-all duration-700 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div className="space-y-4">
              {eyebrow && <span className="section-kicker">{eyebrow}</span>}
              {title && <h2 className="section-heading-compact">{title}</h2>}
            </div>
            <RichText
              richText={richText}
              className="editorial-copy max-w-2xl md:justify-self-end"
            />
          </div>

          {/* Social Media Grid */}
          {Array.isArray(cards) && cards.length > 0 && (
            <div className="mt-10 grid w-full max-w-7xl grid-cols-1 gap-5 opacity-100 transition-all delay-200 duration-700 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
              {cards?.map((card, idx) => (
                <CTACard
                  key={card._key}
                  card={card}
                  className={cn(
                    "editorial-card",
                    idx === 0 && "lg:translate-y-6",
                    idx === 1 && "lg:-translate-y-2",
                    idx === 2 && "lg:translate-y-10",
                    idx === 3 && "lg:translate-y-1",
                  )}
                  eager={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
