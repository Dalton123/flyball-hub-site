"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";

import { BackgroundPattern } from "../elements/background-pattern";
import { HeroFloatingDecoration } from "./hero-floating-decoration";

export type TeamFinderTeaserProps = PagebuilderType<"teamFinderTeaser">;

interface TeamStats {
  teamCount: number;
  countryCount: number;
}

export function TeamFinderTeaser({
  eyebrow,
  title,
  description,
  searchPlaceholder,
  ctaText,
  showStats,
}: TeamFinderTeaserProps) {
  const router = useRouter();
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<TeamStats | null>(null);

  // Fetch team stats on mount
  useEffect(() => {
    if (!showStats) return;

    async function fetchStats() {
      try {
        const res = await fetch(
          "https://app.flyballhub.com/api/v1/teams?limit=500",
        );
        const json = await res.json();
        const teams = json.data || [];

        // Count unique countries
        const countries = new Set(
          teams
            .map((team: { country: string | null }) => team.country)
            .filter(Boolean),
        );

        setStats({
          teamCount: teams.length,
          countryCount: countries.size,
        });
      } catch (err) {
        console.error("Failed to fetch team stats:", err);
        // Fallback stats
        setStats({ teamCount: 150, countryCount: 12 });
      }
    }

    fetchStats();
  }, [showStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/find-a-team?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/find-a-team");
    }
  };

  return (
    <section ref={ref} className="py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/85 via-primary/95 to-primary/75 px-6 py-16 md:px-12 md:py-30">
          {/* Paw prints background pattern */}
          <BackgroundPattern
            pattern="paw-prints"
            opacity={0.1}
            className="text-primary-foreground"
          />

          {/* Diagonal racing lane stripes */}
          <div className="pointer-events-none absolute inset-0 -z-1 overflow-hidden opacity-20">
            <svg
              className="absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="racing-lanes"
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-45)"
                >
                  <rect width="2" height="60" fill="currentColor" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#racing-lanes)"
                className="text-secondary-foreground/5"
              />
            </svg>
          </div>

          {/* Floating tennis balls */}
          <HeroFloatingDecoration
            position="top-right"
            size={60}
            opacity={0.7}
          />
          <HeroFloatingDecoration
            position="bottom-left"
            size={50}
            opacity={0.75}
          />

          {/* Content */}
          <div
            className={`relative z-10 mx-auto max-w-2xl text-center transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {eyebrow && (
              <Badge
                variant="outline"
                className="mb-4 border-secondary-foreground/30 bg-white/80 px-4 py-1.5 text-sm font-medium text-secondary-foreground"
              >
                {eyebrow}
              </Badge>
            )}

            {title && (
              <h2 className="mb-4 text-3xl font-semibold text-primary-foreground md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="mb-8 text-lg text-primary-foreground/80">
                {description}
              </p>
            )}

            {/* Search form */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mb-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder || "Enter city or country..."}
                  className="h-12 rounded-xl border-primary-foreground/60  pl-12 text-base shadow-sm transition-shadow  text-primary-foreground focus:shadow-md focus:ring-2 focus:ring-primary-foreground/20 placeholder:text-primary-foreground bg-primary/90!"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 gap-2 rounded-xl px-6 shadow-md transition-all hover:shadow-lg"
              >
                <Search className="h-4 w-4" />
                {ctaText || "Search"}
              </Button>
            </form>

            {/* Live stats */}
            {showStats && stats && (
              <div
                className={`flex items-center justify-center gap-6 text-secondary-foreground/70 transition-all delay-300 duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {stats.teamCount}+
                  </span>
                  <span className="text-sm text-primary-foreground">Teams</span>
                </div>
                <div className="h-6 w-px bg-primary-foreground/20" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {stats.countryCount}
                  </span>
                  <span className="text-sm text-primary-foreground">
                    Countries
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
