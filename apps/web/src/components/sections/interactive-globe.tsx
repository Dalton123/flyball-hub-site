"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { Color, MeshPhongMaterial } from "three";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

interface GlobePoint {
  name: string;
  locationName: string | null;
  country: string | null;
  lat: number;
  lng: number;
}

interface InteractiveGlobeProps {
  width: number;
  height: number;
  countries: object[];
  teams: GlobePoint[];
  enableZoom: boolean;
  enablePinHover: boolean;
  enablePinClick: boolean;
  onHoverTeam: (team: GlobePoint | null) => void;
  onPointClick: (team: GlobePoint) => void;
  onReady: () => void;
}

export function InteractiveGlobe({
  width,
  height,
  countries,
  teams,
  enableZoom,
  enablePinHover,
  enablePinClick,
  onHoverTeam,
  onPointClick,
  onReady,
}: InteractiveGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color("#c2ffc5"),
        emissive: new Color("#c2ffc5"),
        emissiveIntensity: 0.15,
      }),
    [],
  );

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = enableZoom;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    globe.pointOfView({ lat: 18, lng: 0, altitude: 1.9 });
  }, [enableZoom]);

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl=""
      globeMaterial={globeMaterial}
      showGlobe={true}
      showAtmosphere={true}
      atmosphereColor="rgba(134, 239, 172, 0.5)"
      atmosphereAltitude={0.12}
      polygonsData={countries}
      polygonCapColor={() => "rgba(34, 197, 94, 0.95)"}
      polygonSideColor={() => "rgba(22, 163, 74, 0.4)"}
      polygonStrokeColor={() => "rgba(255, 255, 255, 0.3)"}
      polygonAltitude={0.006}
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
        enablePinHover && onHoverTeam(label as GlobePoint | null)
      }
      onLabelClick={(label) =>
        enablePinClick && onPointClick(label as GlobePoint)
      }
      onGlobeReady={() => {
        window.setTimeout(onReady, 100);
      }}
      ringsData={teams}
      ringLat={(d) => (d as GlobePoint).lat}
      ringLng={(d) => (d as GlobePoint).lng}
      ringColor={() => "rgba(255, 255, 255, 0.6)"}
      ringMaxRadius={2}
      ringPropagationSpeed={2}
      ringRepeatPeriod={3200}
      ringAltitude={0.015}
    />
  );
}
