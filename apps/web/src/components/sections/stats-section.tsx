"use client";

import { Badge } from "@workspace/ui/components/badge";

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";
import { cleanText } from "@/utils";

import { BackgroundPattern } from "../elements/background-pattern";
import { RichText } from "../elements/rich-text";

type StatsSectionProps = PagebuilderType<"statsSection">;

type StatItemProps = {
  stat: NonNullable<StatsSectionProps["stats"]>[number];
  isVisible: boolean;
  variant?: "default" | "accent";
};

function StatItem({ stat, isVisible, variant = "default" }: StatItemProps) {
  const { value, label, description } = stat ?? {};
  const isAccent = variant === "accent";

  return (
    <div
      className={`flex flex-col items-center text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${
          isAccent ? "text-primary-foreground" : "text-primary"
        }`}
      >
        {cleanText(value)}
      </div>
      <div
        className={`text-lg md:text-xl font-semibold mb-2 ${
          isAccent ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        {cleanText(label)}
      </div>
      {description && (
        <div
          className={`text-sm md:text-base ${
            isAccent ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {cleanText(description)}
        </div>
      )}
    </div>
  );
}

export function StatsSection({
  eyebrow,
  title,
  richText,
  stats,
  variant,
}: StatsSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const { containerRef, visibleItems } = useStaggeredAnimation(
    stats?.length ?? 0,
    {
      staggerDelay: 150,
    },
  );

  const effectiveVariant = variant ?? "default";
  const isAccent = effectiveVariant === "accent";

  return (
    <section
      ref={ref}
      className={`py-12 md:py-20 ${isAccent ? "relative overflow-hidden" : ""}`}
    >
      {isAccent && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <BackgroundPattern
            pattern="dots"
            opacity={0.08}
            className="text-primary-foreground"
          />
        </>
      )}

      <div
        className={`container mx-auto px-4 md:px-6 ${isAccent ? "relative z-10" : ""}`}
      >
        {/* Header */}
        <div
          className={`flex w-full flex-col items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6">
            {eyebrow && (
              <Badge
                variant={isAccent ? "default" : "secondary"}
                className={`px-4 py-1.5 text-sm font-medium ${
                  isAccent ? "bg-primary-foreground/90 text-primary" : ""
                }`}
              >
                {cleanText(eyebrow)}
              </Badge>
            )}
            {title && (
              <h2
                className={`text-3xl font-semibold md:text-4xl lg:text-5xl ${
                  isAccent ? "text-primary-foreground" : ""
                }`}
              >
                {cleanText(title)}
              </h2>
            )}
            <RichText
              richText={richText}
              className={`text-base md:text-lg text-balance max-w-3xl ${
                isAccent
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              }`}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div
          ref={containerRef}
          className="mx-auto mt-12 lg:mt-16 grid gap-8 md:gap-12 grid-cols-2 lg:grid-cols-3 max-w-6xl"
        >
          {stats?.map((stat, index) => (
            <StatItem
              key={`Stat-${stat?._key}-${index}`}
              stat={stat}
              isVisible={visibleItems[index] ?? false}
              variant={effectiveVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
