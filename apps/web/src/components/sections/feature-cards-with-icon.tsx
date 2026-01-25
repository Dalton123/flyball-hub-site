"use client";

import { Badge } from "@workspace/ui/components/badge";

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";
import { cleanText } from "@/utils";

import { RichText } from "../elements/rich-text";
import { SanityIcon } from "../elements/sanity-icon";

type FeatureCardsWithIconProps = PagebuilderType<"featureCardsIcon">;

type FeatureCardProps = {
  card: NonNullable<FeatureCardsWithIconProps["cards"]>[number];
  isVisible: boolean;
};

function FeatureCard({ card, isVisible }: FeatureCardProps) {
  const { icon, title, richText } = card ?? {};
  return (
    <div
      className={`rounded-3xl bg-accent/60 border border-border/40 p-6 md:p-8 md:min-h-[280px] transition-all duration-500 hover:bg-accent hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <span className="mb-6 flex w-fit p-3 items-center justify-center rounded-2xl bg-background shadow-md">
        <SanityIcon icon={icon} />
      </span>

      <div>
        <h3 className="text-lg font-semibold md:text-xl mb-3">
          {cleanText(title)}
        </h3>
        <RichText
          richText={richText}
          className="font-normal text-sm md:text-base text-muted-foreground leading-relaxed"
        />
      </div>
    </div>
  );
}

export function FeatureCardsWithIcon({
  eyebrow,
  title,
  richText,
  cards,
}: FeatureCardsWithIconProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const { containerRef, visibleItems } = useStaggeredAnimation(
    cards?.length ?? 0,
    {
      staggerDelay: 150,
    },
  );

  return (
    <section ref={ref} id="features" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`flex w-full flex-col items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                {cleanText(eyebrow)}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {cleanText(title)}
              </h2>
            )}
            <RichText
              richText={richText}
              className="text-base md:text-lg text-muted-foreground text-balance max-w-3xl"
            />
          </div>
        </div>
        <div
          ref={containerRef}
          className="mx-auto mt-12 lg:mt-16 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards?.map((card, index) => (
            <FeatureCard
              key={`FeatureCard-${card?._key}-${index}`}
              card={card}
              isVisible={visibleItems[index] ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
