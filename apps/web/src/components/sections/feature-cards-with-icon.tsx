"use client";

import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

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
      className={`group relative overflow-hidden rounded-[2rem] border border-primary/10 bg-white/55 p-6 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:bg-white/75 hover:shadow-xl md:min-h-[280px] md:p-8 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lime-300 via-secondary to-primary opacity-70" />
      <span className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-accent/70 shadow-sm transition-colors group-hover:bg-secondary/30">
        <SanityIcon icon={icon} className="size-8 text-primary" />
      </span>

      <div>
        <h3 className="text-lg font-semibold md:text-xl mb-3">{title}</h3>
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
  return (
    <section id="features" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center opacity-100 transition-all duration-700">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            <RichText
              richText={richText}
              className="text-base md:text-lg text-muted-foreground text-balance max-w-3xl"
            />
          </div>
        </div>
        <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 md:gap-8 lg:mt-16 lg:grid-cols-3">
          {cards?.map((card, index) => (
            <FeatureCard
              key={`FeatureCard-${card?._key}-${index}`}
              card={card}
              isVisible={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
