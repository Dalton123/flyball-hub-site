"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Loader2, MapPin, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { calculateDistance, geocodeLocation } from "@/lib/geo";
import type { PagebuilderType } from "@/types";

import {
  type SocialLinks,
  TeamCard,
  type TeamCardProps,
  TeamCardSkeleton,
} from "../team-card";

export type TeamFinderProps = PagebuilderType<"teamFinder">;

interface ApiTeam {
  name: string;
  slug: string;
  logo_url: string | null;
  location_name: string | null;
  country: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  leagues: string[];
  social_links: SocialLinks | null;
  primary_color: string | null;
}

type SearchState = "idle" | "searching" | "error";

export function TeamFinder(props: TeamFinderProps) {
  return (
    <Suspense fallback={<TeamFinderSkeleton {...props} />}>
      <TeamFinderContent {...props} />
    </Suspense>
  );
}

function TeamFinderSkeleton({ eyebrow, title, description }: TeamFinderProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="mb-10 text-center">
        {eyebrow && (
          <Badge variant="secondary" className="mb-4">
            {eyebrow}
          </Badge>
        )}
        {title && (
          <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="mx-auto mb-10 flex max-w-xl flex-col gap-3 sm:flex-row">
        <div className="h-12 flex-1 animate-pulse rounded-xl bg-muted" />
        <div className="h-12 w-28 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TeamCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function TeamFinderContent({
  eyebrow,
  title,
  description,
  searchPlaceholder,
  noResultsMessage,
}: TeamFinderProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [searchCoords, setSearchCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geocodeError, setGeocodeError] = useState(false);

  // Fetch teams on mount
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch(
          "https://app.flyballhub.com/api/v1/teams?limit=100",
        );
        const json = await res.json();
        setTeams(json.data || []);
      } catch {
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeams();
  }, []);

  // Auto-search on mount if ?q= param exists
  useEffect(() => {
    if (initialQuery && teams.length > 0) {
      handleSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, teams.length]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchCoords(null);
      setGeocodeError(false);
      return;
    }

    setSearchState("searching");
    setGeocodeError(false);

    const coords = await geocodeLocation(query.trim());

    if (coords) {
      setSearchCoords(coords);
    } else {
      setGeocodeError(true);
      setSearchCoords(null);
    }

    setSearchState("idle");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Filter to teams with location, calculate distances and sort
  const displayTeams = useMemo(() => {
    const teamsWithLocation = teams.filter(
      (team) =>
        team.location_latitude != null && team.location_longitude != null,
    );

    const teamsWithDistance: (TeamCardProps & { sortKey: string | number })[] =
      teamsWithLocation.map((team) => {
        let distance: number | undefined;

        if (
          searchCoords &&
          team.location_latitude != null &&
          team.location_longitude != null
        ) {
          distance = calculateDistance(
            searchCoords.lat,
            searchCoords.lng,
            team.location_latitude,
            team.location_longitude,
          );
        }

        return {
          name: team.name,
          slug: team.slug,
          logoUrl: team.logo_url,
          locationName: team.location_name,
          country: team.country,
          leagues: team.leagues || [],
          socialLinks: team.social_links,
          primaryColor: team.primary_color,
          distance,
          sortKey: distance ?? team.name.toLowerCase(),
        };
      });

    // Sort by distance if searching, otherwise alphabetically
    return teamsWithDistance.sort((a, b) => {
      if (typeof a.sortKey === "number" && typeof b.sortKey === "number") {
        return a.sortKey - b.sortKey;
      }
      if (typeof a.sortKey === "string" && typeof b.sortKey === "string") {
        return a.sortKey.localeCompare(b.sortKey);
      }
      // Teams with distance come first
      if (typeof a.sortKey === "number") return -1;
      if (typeof b.sortKey === "number") return 1;
      return 0;
    });
  }, [teams, searchCoords]);

  return (
    <section className="py-12 md:py-20">
      {/* Header */}
      <div className="mb-10 text-center">
        {eyebrow && (
          <Badge variant="secondary" className="mb-4">
            {eyebrow}
          </Badge>
        )}
        {title && (
          <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-10 flex max-w-xl flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder || "Enter your city or postcode..."}
            className="h-12 rounded-xl pl-12 text-base"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 gap-2 rounded-xl px-6"
          disabled={searchState === "searching"}
        >
          {searchState === "searching" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Search
        </Button>
      </form>

      {/* Geocode Error Notice */}
      {geocodeError && (
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Couldn&apos;t find that location. Showing all teams.
        </p>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      ) : displayTeams.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {noResultsMessage || "No teams found."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayTeams.map((team) => (
            <TeamCard key={team.slug} {...team} />
          ))}
        </div>
      )}
    </section>
  );
}
