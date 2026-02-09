"use client";

import { Button } from "@workspace/ui/components/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, MeshPhongMaterial } from "three";

import type { PagebuilderType } from "@/types";

import { RichText } from "../elements/rich-text";
import { StaticGlobe } from "../elements/static-globe";

// Feature toggles - flip these to enable/disable globe interactions
const ENABLE_ZOOM = false;
const ENABLE_PIN_HOVER = false;
const ENABLE_PIN_CLICK = false;

// Dynamic import to avoid SSR issues with WebGL - no loading spinner needed since we use StaticGlobe
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

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
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<GlobePoint[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [hoveredTeam, setHoveredTeam] = useState<GlobePoint | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const [shouldLoadGlobe, setShouldLoadGlobe] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const test = false;

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

  // Track if globe is currently loading (triggered but not ready)
  const [isLoading, setIsLoading] = useState(false);

  // Trigger globe loading on user interaction (hover or click)
  const handleInteraction = useCallback(() => {
    if (!shouldLoadGlobe) {
      setIsLoading(true);
      setShouldLoadGlobe(true);
    }
  }, [shouldLoadGlobe]);

  // Optional: prefetch globe on idle after page load
  useEffect(() => {
    if (shouldLoadGlobe) return;

    const prefetchOnIdle = () => {
      if ("requestIdleCallback" in window) {
        const idleCallbackId = window.requestIdleCallback(
          () => {
            // Only prefetch if user hasn't already interacted
            if (!shouldLoadGlobe) {
              setIsLoading(true);
              setShouldLoadGlobe(true);
            }
          },
          { timeout: 5000 }, // 5 second timeout
        );
        return () => window.cancelIdleCallback(idleCallbackId);
      }
    };

    // Delay prefetch check to ensure page is fully loaded
    const timer = setTimeout(prefetchOnIdle, 3000);
    return () => clearTimeout(timer);
  }, [shouldLoadGlobe]);

  // Fetch countries GeoJSON for polygon rendering (local cached version)
  useEffect(() => {
    if (!shouldLoadGlobe) return;

    async function fetchCountries() {
      try {
        const res = await fetch("/data/countries.json");
        const data = await res.json();
        setCountries(data.features);
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

  // Configure globe on ready and trigger crossfade
  useEffect(() => {
    if (globeRef.current && globeReady) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = ENABLE_ZOOM;
      // Limit zoom range
      controls.minDistance = 200;
      controls.maxDistance = 500;
      // Point camera at UK initially
      globeRef.current.pointOfView({ lat: 54, lng: -2, altitude: 1.8 });

      // Small delay to ensure globe has rendered, then crossfade
      const timer = setTimeout(() => {
        setGlobeVisible(true);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [globeReady]);

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

  // Create globe material for water using tree-shakeable ES imports
  const globeMaterial = useMemo(() => {
    return new MeshPhongMaterial({
      color: new Color("#c2ffc5"),
      emissive: new Color("#c2ffc5"),
      emissiveIntensity: 0.15,
    });
  }, []);

  return (
    <section className="relative lg:min-h-[85dvh] overflow-hidden bg-linear-to-br from-primary via-primary to-primary/90 pb-8 lg:pb-0">
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
      <div className="pointer-events-none absolute right-0 top-1/2 size-175 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-[100px] lg:translate-x-0" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:min-h-[85dvh] items-center gap-4 lg:grid-cols-2 ">
          {/* Content Side */}
          <div className="order-2 space-y-6 text-center lg:order-1 lg:space-y-8 lg:text-left">
            {badge && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
                {badge}
              </span>
            )}

            {title && (
              <h1 className="font-hero text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                {title}
              </h1>
            )}

            {richText && richText.length > 0 && (
              <div className="mx-auto max-w-xl text-lg leading-relaxed text-white/80 lg:mx-0 lg:text-xl">
                <RichText
                  className="text-center lg:text-left text-white/80"
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
                        ? "border-white bg-transparent px-8 py-6 text-lg text-white hover:bg-white hover:text-primary"
                        : "bg-white px-8 py-6 text-lg text-primary shadow-lg transition-all hover:border-white border border-transparent hover:bg-transparent hover:text-white"
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
              <div className="flex flex-wrap justify-center gap-8 pt-4 text-white/70 lg:justify-start">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <span className="block text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                    <span className="text-sm">{stat.label}</span>
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
            className="relative order-1 flex h-70 cursor-pointer items-center justify-center lg:order-2 lg:h-150"
          >
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

            {/* Interactive globe - loads in background, fades in when ready */}
            {shouldLoadGlobe && (
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                  globeVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <Globe
                  ref={globeRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  backgroundColor="rgba(0,0,0,0)"
                  globeImageUrl=""
                  globeMaterial={globeMaterial}
                  showGlobe={true}
                  showAtmosphere={true}
                  atmosphereColor="rgba(134, 239, 172, 0.5)"
                  atmosphereAltitude={0.12}
                  // Country polygons - green land
                  polygonsData={countries}
                  polygonCapColor={() => "rgba(34, 197, 94, 0.95)"}
                  polygonSideColor={() => "rgba(22, 163, 74, 0.4)"}
                  polygonStrokeColor={() => "rgba(255, 255, 255, 0.3)"}
                  polygonAltitude={0.006}
                  // Team location markers
                  labelsData={teams}
                  labelLat={(d) => (d as GlobePoint).lat}
                  labelLng={(d) => (d as GlobePoint).lng}
                  labelText={() => ""}
                  labelSize={0}
                  labelDotRadius={0.4}
                  labelColor={() => "#ffffff"}
                  labelResolution={2}
                  labelAltitude={0.01}
                  onLabelHover={(label) =>
                    ENABLE_PIN_HOVER &&
                    setHoveredTeam(label as GlobePoint | null)
                  }
                  onLabelClick={(label) =>
                    ENABLE_PIN_CLICK && handlePointClick(label as GlobePoint)
                  }
                  onGlobeReady={() => setGlobeReady(true)}
                  // Pulse rings around team locations - white
                  ringsData={teams}
                  ringLat={(d) => (d as GlobePoint).lat}
                  ringLng={(d) => (d as GlobePoint).lng}
                  ringColor={() => "rgba(255, 255, 255, 0.6)"}
                  ringMaxRadius={2}
                  ringPropagationSpeed={2}
                  ringRepeatPeriod={3200}
                  ringAltitude={0.015}
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
