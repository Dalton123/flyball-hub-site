"use client";

import { Badge } from "@workspace/ui/components/badge";

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";
import { cleanText } from "@/utils";

import { RichText } from "../elements/rich-text";
import { SanityImage } from "../elements/sanity-image";

type LogoCloudProps = PagebuilderType<"logoCloud">;

type LogoItemProps = {
  logo: NonNullable<LogoCloudProps["logos"]>[number];
  isVisible: boolean;
};

function LogoItem({ logo, isVisible }: LogoItemProps) {
  const { name, logo: logoImage, url } = logo ?? {};

  const content = (
    <div
      className={`flex items-center justify-center p-6 md:p-8 rounded-2xl  ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="relative w-full flex grayscale hover:grayscale-0 transition-all duration-300">
        {logoImage && (
          <SanityImage
            className="image-contain"
            image={logoImage}
            alt={logoImage?.alt || name || "Logo"}
          />
        )}
      </div>
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex items-center justify-center"
        aria-label={`Visit ${name}'s website`}
      >
        {content}
      </a>
    );
  }

  return content;
}

export function LogoCloud({ eyebrow, title, richText, logos }: LogoCloudProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const { containerRef, visibleItems } = useStaggeredAnimation(
    logos?.length ?? 0,
    {
      staggerDelay: 100,
    },
  );

  return (
    <section ref={ref} className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className={`flex w-full flex-col items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6">
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

        {/* Logos grid */}
        <div
          ref={containerRef}
          className="mx-auto mt-12 lg:mt-16 grid gap-6 md:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-5xl"
        >
          {logos?.map((logo, index) => (
            <LogoItem
              key={`Logo-${logo?._key}-${index}`}
              logo={logo}
              isVisible={visibleItems[index] ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
