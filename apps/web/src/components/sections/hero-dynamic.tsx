"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";
import { cleanText } from "@/utils";

import { BackgroundPattern } from "../elements/background-pattern";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";
import { SanityImage } from "../elements/sanity-image";
import { HeroBackground } from "./hero-background";
import { HeroFloatingCard } from "./hero-floating-card";
import { HeroFloatingDecoration } from "./hero-floating-decoration";
import { HeroStats } from "./hero-stats";

export type HeroDynamicProps = PagebuilderType<"hero">;

export function HeroDynamic({
  badge,
  title,
  richText,
  image,
  buttons,
  stats,
}: HeroDynamicProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section ref={ref} id="hero" className="relative overflow-hidden">
      {/* Background Layers */}
      <HeroBackground />
      <BackgroundPattern pattern="tennis-balls" opacity={0.08} />

      {/* Floating Tennis Balls */}
      <HeroFloatingDecoration position="top-right" size={100} opacity={0.5} />
      <HeroFloatingDecoration position="left" size={70} opacity={0.3} />
      <HeroFloatingDecoration position="bottom-left" size={90} opacity={0.4} />
      <HeroFloatingDecoration
        position="bottom-right"
        size={120}
        opacity={0.4}
      />

      <div className="container mx-auto px-4 relative z-10 py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Content - 7 columns */}
          <div className="lg:col-span-7 space-y-4 lg:space-y-6">
            {/* Badge */}
            {badge && (
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Badge
                  variant="secondary"
                  className="px-4 py-1.5 text-sm font-medium"
                >
                  {cleanText(badge)}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1
              className={`
                font-hero font-black
                text-5xl sm:text-7xl lg:text-7xl xl:text-8xl
                leading-[0.9]
                bg-gradient-to-br from-primary via-primary to-secondary
                bg-clip-text text-transparent
                transition-all duration-700 delay-100
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
            >
              {cleanText(title)}
            </h1>

            {/* Description */}
            <div
              className={`max-w-xl text-base md:text-lg lg:text-xl text-foreground/80 transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <RichText richText={richText} />
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {buttons && buttons.length > 0 ? (
                <SanityButtons
                  buttons={buttons}
                  buttonClassName="px-8 lg:px-12 py-5 lg:py-6 text-lg lg:text-xl"
                  className="flex flex-col sm:flex-row gap-4"
                />
              ) : (
                <>
                  <Button
                    size="lg"
                    className="
                      px-8 lg:px-12 py-5 lg:py-6 text-lg lg:text-xl
                      bg-gradient-to-r from-primary to-primary/90
                      shadow-lg shadow-primary/20
                      hover:shadow-xl hover:shadow-primary/30
                      hover:-translate-y-1
                      transition-all duration-300
                    "
                  >
                    Get Started Free
                    <ArrowRight className="ml-2" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 lg:px-12 py-5 lg:py-6 text-lg lg:text-xl hover:bg-primary hover:text-primary-foreground"
                  >
                    Watch Demo
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <HeroStats stats={stats} />
          </div>

          {/* Screenshot + Floating Cards - 5 columns */}
          <div className="lg:col-span-5 relative">
            <div
              className={`relative transition-all duration-700 delay-600 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* Main Screenshot */}
              {image && (
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 ring-1 ring-primary/10"
                  style={{
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.1), 0 0 60px rgba(var(--primary-rgb, 66, 153, 66), 0.15)",
                  }}
                >
                  <SanityImage
                    image={image}
                    alt={title || "Hero image"}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              )}

              {/* Floating Cards - Placeholders for user's screenshots */}
              {/* Users can replace these with actual card components showing their app UI */}
              <HeroFloatingCard position="top-right" delay={800}>
                <div className="space-y-1">
                  <div className="text-xs xl:text-sm font-semibold">
                    Dog Profile
                  </div>
                  <div className="text-[10px] xl:text-xs text-muted-foreground">
                    Quick access to team member info
                  </div>
                </div>
              </HeroFloatingCard>

              <HeroFloatingCard position="left" delay={1000}>
                <div className="space-y-1">
                  <div className="text-xs xl:text-sm font-semibold">
                    Team Stats
                  </div>
                  <div className="text-[10px] xl:text-xs text-muted-foreground">
                    Real-time performance tracking
                  </div>
                </div>
              </HeroFloatingCard>

              <HeroFloatingCard position="bottom-right" delay={1200}>
                <div className="space-y-1">
                  <div className="text-xs xl:text-sm font-semibold">
                    Event Notification
                  </div>
                  <div className="text-[10px] xl:text-xs text-muted-foreground">
                    Never miss a tournament
                  </div>
                </div>
              </HeroFloatingCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
