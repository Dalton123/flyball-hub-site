"use client";

import { memo } from "react";
import Image from "next/image";

interface StaticGlobeProps {
  width: number;
  height: number;
  className?: string;
}

function StaticGlobeComponent({ width, height, className }: StaticGlobeProps) {
  return (
    <Image
      src="/images/globe-placeholder.webp"
      width={width}
      height={height}
      alt="Globe placeholder"
      className={`${className} h-full object-contain! max-h-70 lg:max-h-150 max-lg:w-[70%]!`}
      priority
    />
  );
}

export const StaticGlobe = memo(StaticGlobeComponent);
