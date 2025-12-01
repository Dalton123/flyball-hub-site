"use client";

import type { ReactNode } from "react";

interface FloatingCardProps {
  position: "top-right" | "left" | "bottom-right";
  delay: number;
  children: ReactNode;
}

export function HeroFloatingCard({ position, delay, children }: FloatingCardProps) {
  const positionClasses = {
    "top-right": "top-8 -right-12 lg:-right-16",
    left: "top-1/3 -left-8 lg:-left-12",
    "bottom-right": "bottom-12 -right-8 lg:-right-12",
  };

  const animationClass =
    position.includes("right") ? "animate-float-in-right" : "animate-float-in-left";

  return (
    <div
      className={`
        absolute ${positionClasses[position]}
        hidden lg:block
        ${animationClass}
        opacity-0
        hover:scale-105 hover:rotate-1 transition-all duration-300
        z-20
      `}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className="bg-card rounded-2xl shadow-2xl p-4 border border-border">
        {children}
      </div>
    </div>
  );
}
