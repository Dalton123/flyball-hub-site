"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Star } from "lucide-react";
import type { PagebuilderType } from "@/types";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/use-scroll-animation";
import { cleanText } from "@/utils";
import { SanityImage } from "../elements/sanity-image";
import { RichText } from "../elements/rich-text";

type TestimonialsProps = PagebuilderType<"testimonials">;

type TestimonialCardProps = {
  testimonial: NonNullable<TestimonialsProps["testimonials"]>[number];
  isVisible: boolean;
};

function TestimonialCard({ testimonial, isVisible }: TestimonialCardProps) {
  const { quote, authorName, authorRole, authorImage, rating } = testimonial ?? {};

  return (
    <div
      className={`rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Rating stars */}
      {rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating
                  ? "fill-secondary text-secondary"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-base md:text-lg text-foreground mb-6 flex-grow">
        "{cleanText(quote)}"
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-4">
        {authorImage && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <SanityImage image={authorImage} alt={authorImage?.alt || authorName || "Testimonial author"} />
          </div>
        )}
        <div>
          <div className="font-semibold text-foreground">{cleanText(authorName)}</div>
          {authorRole && (
            <div className="text-sm text-muted-foreground">{cleanText(authorRole)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Testimonials({
  eyebrow,
  title,
  richText,
  testimonials,
}: TestimonialsProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const { containerRef, visibleItems } = useStaggeredAnimation(testimonials?.length ?? 0, {
    staggerDelay: 150,
  });

  return (
    <section ref={ref} className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className={`flex w-full flex-col items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6">
            {eyebrow && (
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
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

        {/* Testimonials grid */}
        <div
          ref={containerRef}
          className="mx-auto mt-12 lg:mt-16 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials?.map((testimonial, index) => (
            <TestimonialCard
              key={`Testimonial-${testimonial?._key}-${index}`}
              testimonial={testimonial}
              isVisible={visibleItems[index] ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
