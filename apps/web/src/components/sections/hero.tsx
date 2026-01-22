"use client";

import { Badge } from "@workspace/ui/components/badge";
import dynamic from "next/dynamic";

import type { PagebuilderType } from "@/types";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cleanText } from "@/utils";

import { BackgroundPattern } from "../elements/background-pattern";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";
import { SanityImage } from "../elements/sanity-image";

// Hero loading skeleton
function HeroSkeleton() {
  return (
    <section className="relative min-h-[85dvh] overflow-hidden bg-primary/90 pb-8 lg:pb-0">
      <div className="container mx-auto px-4">
        <div className="grid min-h-[85dvh] items-center gap-8 lg:grid-cols-2 lg:gap-4">
          <div className="order-2 space-y-6 text-center lg:order-1 lg:space-y-8 lg:text-left">
            <div className="h-8 w-32 animate-pulse rounded-full bg-white/15" />
            <div className="h-16 w-3/4 animate-pulse rounded bg-white/15" />
            <div className="h-24 w-full animate-pulse rounded bg-white/15" />
          </div>
          <div className="order-1 flex h-120 items-center justify-center lg:order-2 lg:h-120">
            <div className="h-96 w-96 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Dynamic import hero variants - only loads when needed
const HeroGlobe = dynamic(() => import("./hero-globe").then((mod) => mod.HeroGlobe), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

const HeroDynamic = dynamic(() => import("./hero-dynamic").then((mod) => mod.HeroDynamic), {
  loading: () => <HeroSkeleton />,
});

type HeroBlockProps = PagebuilderType<"hero">;

export function HeroBlock(props: HeroBlockProps) {
  // Route to globe variant if selected
  if (props.variant === "globe") {
    return <HeroGlobe {...props} />;
  }

  // Route to dynamic variant if selected
  if (props.variant === "dynamic") {
    return <HeroDynamic {...props} />;
  }

  // Classic hero variant (default)
  const { title, buttons, badge, image, richText } = props;
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative mt-4 md:my-16 overflow-hidden"
    >
      {/* Subtle background pattern */}
      <BackgroundPattern pattern="tennis-balls" opacity={0.03} />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            className={`grid h-full grid-rows-[auto_1fr_auto] gap-4 items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {badge && (
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                {cleanText(badge)}
              </Badge>
            )}
            <div className="grid gap-4 lg:gap-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-balance leading-tight">
                {cleanText(title)}
              </h1>
              <RichText
                richText={richText}
                className="text-base md:text-lg font-normal lg:text-left text-center text-muted-foreground max-w-xl"
              />
            </div>
            <SanityButtons
              buttons={buttons}
              buttonClassName="w-full sm:w-auto"
              className="w-full sm:w-fit grid gap-3 sm:grid-flow-col lg:justify-start mt-2"
            />
          </div>

          {image && (
            <div
              className={`relative h-80 md:h-96 lg:h-[28rem] w-full transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Decorative accent behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-accent/30 rounded-[2rem] -z-10" />
              <SanityImage
                image={image}
                alt={image?.alt || "Hero image"}
                loading="eager"
                width={800}
                height={800}
                fetchPriority="high"
                className="h-full w-full rounded-3xl object-cover shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
