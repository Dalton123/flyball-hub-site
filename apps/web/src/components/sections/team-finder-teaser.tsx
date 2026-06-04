"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { ref } = useScrollAnimation<HTMLElement>({
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
    <section ref={ref} className="bg-background py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="sport-panel relative overflow-hidden rounded-[2rem] px-6 py-16 md:rounded-[3rem] md:px-12 md:py-24 lg:px-16">
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
          <div className="relative z-10 mx-auto grid max-w-5xl gap-8 text-center opacity-100 transition-all duration-700 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:text-left">
            <div className="space-y-5">
              {eyebrow && <span className="section-kicker-dark">{eyebrow}</span>}

              {title && <h2 className="section-heading text-white">{title}</h2>}

              {description && (
                <p className="text-lg leading-8 text-primary-foreground/80 md:text-xl">
                  {description}
                </p>
              )}
            </div>

            {/* Search form */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-4 shadow-2xl shadow-black/20 backdrop-blur-sm md:p-5">
              <form
                onSubmit={handleSearch}
                className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row lg:mx-0"
              >
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder || "Enter city or country..."}
                    className="h-14 rounded-2xl border-white/20 bg-white/[0.12]! pl-12 text-base text-primary-foreground shadow-sm transition-shadow placeholder:text-primary-foreground/50 focus:shadow-md focus:ring-2 focus:ring-secondary/45"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 gap-2 rounded-2xl bg-secondary px-7 font-black text-secondary-foreground shadow-md shadow-secondary/20 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-lg"
                >
                  <Search className="h-4 w-4" />
                  {ctaText || "Search"}
                </Button>
              </form>

              {/* Live stats */}
              {showStats && stats && (
                <div className="mt-5 grid grid-cols-2 gap-3 text-left text-secondary-foreground/70 opacity-100 transition-all delay-300 duration-700">
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <span className="block text-3xl font-black tracking-tight text-primary-foreground">
                      {stats.teamCount}+
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/60">
                      Teams
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                    <span className="block text-3xl font-black tracking-tight text-primary-foreground">
                      {stats.countryCount}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/60">
                      Countries
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
