"use client";

import { useState } from "react";

import { useStaggeredAnimation } from "@/hooks/use-scroll-animation";
import type { BreedCardData } from "@/types";

import { BreedCard } from "./breed-card";

type FilterKey = "all" | "Small" | "Medium" | "Large" | "heightDog" | "fast";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Small", label: "Small" },
  { key: "Medium", label: "Medium" },
  { key: "Large", label: "Large" },
  { key: "heightDog", label: "Height Dogs" },
  { key: "fast", label: "Fast" },
];

const TOP_RATED_THRESHOLD = 5;

function filterBreeds(breeds: BreedCardData[], filter: FilterKey): BreedCardData[] {
  if (filter === "all") return breeds;
  if (filter === "heightDog") return breeds.filter((b) => b.stats?.heightDog);
  if (filter === "fast")
    return breeds.filter(
      (b) => b.stats?.speed === "Fast" || b.stats?.speed === "Very Fast",
    );
  return breeds.filter((b) => b.stats?.size === filter);
}

interface BreedGridProps {
  breeds: BreedCardData[];
}

export function BreedGrid({ breeds }: BreedGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const filtered = filterBreeds(breeds, activeFilter);
  const { containerRef, visibleItems } = useStaggeredAnimation(
    filtered.length,
    { staggerDelay: 100 },
  );

  return (
    <div>
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          ref={containerRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((breed, index) => (
            <div
              key={breed._id}
              className={`transition-all duration-500 ${
                visibleItems[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <BreedCard
                breed={breed}
                showTopRated={(breed.verdictRating ?? 0) >= TOP_RATED_THRESHOLD}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No breeds match this filter yet. Check back as we add more guides!
          </p>
        </div>
      )}
    </div>
  );
}
