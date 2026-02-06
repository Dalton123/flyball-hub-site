"use client";

import type { BreedPageData } from "@/types";
import { cleanText } from "@/utils";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";
import { BreedProsCons } from "./breed-pros-cons";
import { BreedStatsCard } from "./breed-stats-card";

interface BreedPageProps {
  breed: BreedPageData;
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-2xl text-amber-500 tracking-wider"
        aria-label={`${rating} out of 5 stars`}
      >
        {stars}
      </span>
      <span className="text-muted-foreground text-sm">({rating}/5)</span>
    </div>
  );
}

export function BreedPage({ breed }: BreedPageProps) {
  const { name, verdict, verdictRating, image, stats, pros, cons, richText } =
    breed;

  return (
    <div className="container mx-auto px-4 pb-8 md:pb-16">
      {/* Hero Section */}
      <header className="mb-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          {image?.id && (
            <div className="order-1 lg:order-2">
              <SanityImage
                image={image}
                alt={name ?? "Dog breed"}
                width={800}
                height={600}
                loading="eager"
                className="rounded-2xl w-full h-auto object-cover shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold md:text-5xl mb-4">
              {cleanText(name)}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {cleanText(verdict)}
            </p>
            <StarRating rating={verdictRating} />
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main Column */}
        <main>
          {/* Pros/Cons Section */}
          <BreedProsCons pros={pros} cons={cons} className="mb-8" />

          {/* Rich Text Content */}
          {richText && richText.length > 0 && (
            <div className="mt-8">
              <RichText richText={richText} />
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BreedStatsCard stats={stats} />
        </aside>
      </div>
    </div>
  );
}
