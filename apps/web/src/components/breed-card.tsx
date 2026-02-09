"use client";
import Link from "next/link";

import type { BreedCardData } from "@/types";

import { SanityImage } from "./elements/sanity-image";

interface BreedCardProps {
  breed: BreedCardData;
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return (
    <span className="text-amber-500 text-sm tracking-wider" aria-label={`${rating} out of 5 stars`}>
      {stars}
    </span>
  );
}

export function BreedCard({ breed }: BreedCardProps) {
  if (!breed) return null;

  const { name, slug, verdict, verdictRating, image, stats } = breed;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={slug ?? "#"} className="block aspect-[4/3] overflow-hidden">
        {image?.id && (
          <SanityImage
            image={image}
            width={400}
            height={300}
            alt={name ?? "Dog breed"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">
            <Link href={slug ?? "#"} className="hover:underline">
              {name}
            </Link>
          </h3>
          <StarRating rating={verdictRating} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {verdict}
        </p>
        {stats && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {stats.size && (
              <span className="rounded-full bg-muted px-2 py-0.5">
                {stats.size}
              </span>
            )}
            {stats.speed && (
              <span className="rounded-full bg-muted px-2 py-0.5">
                {stats.speed}
              </span>
            )}
            {stats.heightDog && (
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">
                Height Dog
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
