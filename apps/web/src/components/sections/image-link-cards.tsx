"use client";

import { Badge } from "@workspace/ui/components/badge";
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
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section ref={ref} id="image-link-cards" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div
            className={`flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {eyebrow && (
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-balance">
                {title}
              </h2>
            )}
            <RichText
              richText={richText}
              className="text-balance text-muted-foreground max-w-2xl"
            />
          </div>

          {/* Social Media Grid */}
          {Array.isArray(cards) && cards.length > 0 && (
            <div
              className={`mt-12 lg:mt-16 grid w-full grid-cols-1 gap-4 lg:gap-1 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {cards?.map((card, idx) => (
                <CTACard
                  key={card._key}
                  card={card}
                  className={cn(
                    "bg-muted",
                    idx === 0 && "lg:rounded-l-3xl lg:rounded-r-none",
                    idx === cards.length - 1 &&
                      "lg:rounded-r-3xl lg:rounded-l-none",
                    idx !== 0 && idx !== cards.length - 1 && "lg:rounded-none",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
