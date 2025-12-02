"use client";

import { TennisBall } from "../icons/tennis-ball";

interface FloatingDecorationProps {
  position: "top-right" | "left" | "bottom-left" | "bottom-right";
  size?: number;
  opacity?: number;
}

export function HeroFloatingDecoration({
  position,
  size = 80,
  opacity = 0.15,
}: FloatingDecorationProps) {
  const positionClasses = {
    "top-right": "top-16 right-12 md:right-24",
    left: "top-1/3 left-8 md:left-16 rotate-12",
    "bottom-left": "bottom-16 left-12 md:left-24 -rotate-28",
    "bottom-right": "bottom-46 right-25 md:right-42 rotate-12",
  };

  const animationClass = position === "left" ? "float-diagonal" : "float-slow";
  const duration = position === "left" ? "6s" : "8s";

  return (
    <div
      className={`absolute ${positionClasses[position]} hidden md:block pointer-events-none`}
      style={{
        animation: `${animationClass} ${duration} ease-in-out infinite`,
        opacity,
        zIndex: 1,
      }}
    >
      <TennisBall size={size} className="text-secondary drop-shadow-sm" />
    </div>
  );
}
