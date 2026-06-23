"use client";

import { Button } from "@workspace/ui/components/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import type { PagebuilderType } from "@/types";

import { RichText } from "../elements/rich-text";
import { StaticGlobe } from "../elements/static-globe";

const InteractiveGlobe = dynamic(
  () => import("./interactive-globe").then((mod) => mod.InteractiveGlobe),
  { ssr: false },
);

// Feature toggles - flip these to enable/disable globe interactions
const ENABLE_ZOOM = false;
const ENABLE_PIN_HOVER = false;
const ENABLE_PIN_CLICK = false;

interface TeamLocation {
  name: string;
  location_name: string | null;
  country: string | null;
  location_latitude: number;
  location_longitude: number;
}

interface GlobePoint {
  name: string;
  locationName: string | null;
  country: string | null;
  lat: number;
  lng: number;
}

type HeroGlobeProps = PagebuilderType<"hero">;

export function HeroGlobe({
  badge,
  title,
  richText,
  buttons,
  stats,
}: HeroGlobeProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<GlobePoint[]>([]);
  const [countries, setCountries] = useState<object[]>([]);
  const [hoveredTeam, setHoveredTeam] = useState<GlobePoint | null>(null);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [shouldLoadGlobe, setShouldLoadGlobe] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height, 900);
        setDimensions({ width: size, height: size });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Trigger globe loading on user interaction (hover or click)
  const handleInteraction = useCallback(() => {
    if (!shouldLoadGlobe) {
      setShouldLoadGlobe(true);
    }
  }, [shouldLoadGlobe]);

  // Fetch countries GeoJSON for polygon rendering (local cached version)
  useEffect(() => {
    if (!shouldLoadGlobe) return;

    async function fetchCountries() {
      try {
        const res = await fetch("/data/countries.json");
        const data = await res.json();
        setCountries(data.features ?? []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    }
    fetchCountries();
  }, [shouldLoadGlobe]);

  // Fetch teams from API (only when globe should load)
  useEffect(() => {
    if (!shouldLoadGlobe) return;

    async function fetchTeams() {
      try {
        const res = await fetch(
          "https://app.flyballhub.com/api/v1/teams?limit=100",
        );
        const json = await res.json();
        const teamsData = json.data || [];

        // Filter teams with valid coordinates and map to globe format
        const validTeams: GlobePoint[] = teamsData
          .filter(
            (team: TeamLocation) =>
              team.location_latitude != null && team.location_longitude != null,
          )
          .map((team: TeamLocation) => ({
            name: team.name,
            locationName: team.location_name,
            country: team.country,
            lat: team.location_latitude,
            lng: team.location_longitude,
          }));

        setTeams(validTeams);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        // Fallback demo data for development
        setTeams([
          {
            name: "Lightning Paws",
            locationName: "London",
            country: "GB",
            lat: 51.5,
            lng: -0.1,
          },
          {
            name: "Speed Demons",
            locationName: "Manchester",
            country: "GB",
            lat: 53.5,
            lng: -2.2,
          },
          {
            name: "Bark Raiders",
            locationName: "New York",
            country: "US",
            lat: 40.7,
            lng: -74.0,
          },
          {
            name: "Flyball Fury",
            locationName: "Sydney",
            country: "AU",
            lat: -33.9,
            lng: 151.2,
          },
          {
            name: "Nordic Runners",
            locationName: "Stockholm",
            country: "SE",
            lat: 59.3,
            lng: 18.1,
          },
        ]);
      }
    }
    fetchTeams();
  }, [shouldLoadGlobe]);

  const handlePointClick = useCallback(
    (point: GlobePoint) => {
      if (point.country) {
        router.push(`/find-a-team?country=${point.country}`);
      } else {
        router.push("/find-a-team");
      }
    },
    [router],
  );

  return (
    <section className="sport-panel relative overflow-hidden pb-10 lg:min-h-[86dvh] lg:pb-0">
      {/* SVG noise texture overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30">
        <defs>
          <filter id="hero-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* Soft glow behind globe */}
      <div className="pointer-events-none absolute right-0 top-1/2 size-175 -translate-y-1/2 translate-x-1/4 rounded-full bg-secondary/15 blur-[100px] lg:translate-x-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/20 to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-8 py-10 lg:min-h-[86dvh] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 lg:py-0">
          {/* Content Side */}
          <div className="order-2 space-y-6 text-center lg:order-1 lg:space-y-8 lg:text-left">
            {badge && <span className="section-kicker-dark">{badge}</span>}

            {title && (
              <h1 className="font-sans text-5xl font-black leading-[0.9] tracking-[-0.055em] text-white text-balance sm:text-6xl lg:text-7xl xl:text-8xl">
                {title}
              </h1>
            )}

            {richText && richText.length > 0 && (
              <div className="mx-auto max-w-xl text-lg leading-8 text-white/85 lg:mx-0 lg:text-xl">
                <RichText
                  className="text-center lg:text-left text-white/85"
                  richText={richText}
                />
              </div>
            )}

            {buttons && buttons.length > 0 && (
              <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
                {buttons.map((button) => (
                  <Button
                    key={button._key}
                    size="lg"
                    variant={
                      button.variant === "outline" ? "outline" : "default"
                    }
                    className={
                      button.variant === "outline"
                        ? "border-white/60 bg-white/5 px-8 py-6 text-lg text-white hover:bg-white hover:text-primary focus-visible:ring-secondary"
                        : "border border-secondary bg-secondary px-8 py-6 text-lg font-black text-secondary-foreground shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-primary focus-visible:ring-secondary"
                    }
                    onClick={() => router.push(button.href || "/")}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 pt-2 text-white/70 lg:justify-start">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="block text-2xl font-black tracking-tight text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Globe Side */}
          <div
            ref={containerRef}
            onMouseEnter={handleInteraction}
            onClick={handleInteraction}
            className="relative order-1 flex h-78 cursor-pointer items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-sm lg:order-2 lg:h-150 lg:rounded-[3rem]"
          >
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/12 bg-black/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
              Global team map
            </div>
            {/* Static placeholder - shown immediately, fades out when interactive globe is ready */}
            <div
              className={`lg:absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                globeVisible
                  ? "pointer-events-none absolute opacity-0 hidden"
                  : "opacity-100"
              }`}
            >
              <div className="relative flex justify-center items-center">
                <StaticGlobe
                  width={dimensions.width}
                  height={dimensions.height}
                />
              </div>
            </div>

            {/* Interactive globe - loads only after interaction, then fades in when ready */}
            {shouldLoadGlobe && (
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  globeVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <InteractiveGlobe
                  width={dimensions.width}
                  height={dimensions.height}
                  countries={countries}
                  teams={teams}
                  enableZoom={ENABLE_ZOOM}
                  enablePinHover={ENABLE_PIN_HOVER}
                  enablePinClick={ENABLE_PIN_CLICK}
                  onHoverTeam={setHoveredTeam}
                  onPointClick={handlePointClick}
                  onReady={() => setGlobeVisible(true)}
                />
              </div>
            )}

            {/* Hover tooltip */}
            {ENABLE_PIN_HOVER && hoveredTeam && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                <div className="animate-in fade-in zoom-in-95 rounded-lg border border-white/20 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm duration-200">
                  <p className="font-semibold text-primary">
                    {hoveredTeam.name}
                  </p>
                  <p className="text-sm text-primary/70">
                    {hoveredTeam.locationName}
                    {hoveredTeam.country && `, ${hoveredTeam.country}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
