"use client";

import { memo } from "react";
import Image, { type ImageProps } from "next/image";
import { dataset, projectId } from "@/config";
import type { SanityImageProps as SanityImageData } from "@/types";

// Types
interface ImageHotspot {
  readonly x: number;
  readonly y: number;
}

interface ImageCrop {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
}

interface ProcessedImageData {
  readonly id: string;
  readonly preview?: string;
  readonly hotspot?: ImageHotspot;
  readonly crop?: ImageCrop;
}

type SanityImageProps = {
  readonly image: SanityImageData;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly fill?: boolean;
  readonly sizes?: string;
  readonly priority?: boolean;
  readonly loading?: "lazy" | "eager";
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly decoding?: "async" | "auto" | "sync";
  readonly fetchPriority?: "high" | "low" | "auto";
};

// Type guards
function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isValidHotspot(hotspot: unknown): hotspot is ImageHotspot {
  if (!hotspot || typeof hotspot !== "object") return false;
  const h = hotspot as Record<string, unknown>;
  return isValidNumber(h.x) && isValidNumber(h.y);
}

function isValidCrop(crop: unknown): crop is ImageCrop {
  if (!crop || typeof crop !== "object") return false;
  const c = crop as Record<string, unknown>;
  return (
    isValidNumber(c.top) &&
    isValidNumber(c.bottom) &&
    isValidNumber(c.left) &&
    isValidNumber(c.right)
  );
}

// Pure functions for data processing
function extractHotspot(image: SanityImageData): ImageHotspot | undefined {
  if (!isValidHotspot(image?.hotspot)) return undefined;
  return {
    x: image.hotspot.x,
    y: image.hotspot.y,
  };
}

function extractCrop(image: SanityImageData): ImageCrop | undefined {
  if (!isValidCrop(image?.crop)) return undefined;
  return {
    top: image.crop.top,
    bottom: image.crop.bottom,
    left: image.crop.left,
    right: image.crop.right,
  };
}

function hasPreview(preview: unknown): preview is string {
  return typeof preview === "string" && preview.length > 0;
}

// Main image processing function
function processImageData(image: SanityImageData): ProcessedImageData | null {
  if (!image?.id || typeof image.id !== "string") {
    console.warn("SanityImage: Invalid image data provided", image);
    return null;
  }

  const hotspot = extractHotspot(image);
  const crop = extractCrop(image);
  const preview = hasPreview(image.preview) ? image.preview : undefined;

  return {
    id: image.id,
    ...(preview && { preview }),
    ...(hotspot && { hotspot }),
    ...(crop && { crop }),
  };
}

// Parse Sanity image ID to get dimensions and format
function parseImageId(id: string): { baseId: string; width: number; height: number; format: string } {
  // Format: image-{hash}-{width}x{height}-{format}
  const match = id.match(/^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-(\w+)$/);
  if (match && match[1] && match[2] && match[3] && match[4]) {
    return {
      baseId: match[1],
      width: parseInt(match[2], 10),
      height: parseInt(match[3], 10),
      format: match[4],
    };
  }
  // Fallback for non-standard IDs
  return { baseId: id.replace(/^image-/, ""), width: 800, height: 600, format: "jpg" };
}

// Build Sanity CDN URL with transformations
function buildSanityUrl(
  id: string,
  width: number,
  crop?: ImageCrop,
  hotspot?: ImageHotspot
): string {
  const { baseId, width: originalWidth, height: originalHeight, format } = parseImageId(id);
  const params = new URLSearchParams();

  params.set("w", width.toString());
  params.set("auto", "format");
  params.set("fit", "max");
  params.set("q", "75");

  // Apply crop if present
  if (crop) {
    const rect = `${crop.left},${crop.top},${1 - crop.left - crop.right},${1 - crop.top - crop.bottom}`;
    params.set("rect", rect);
  }

  // Apply hotspot for focal point cropping
  if (hotspot) {
    params.set("fp-x", hotspot.x.toString());
    params.set("fp-y", hotspot.y.toString());
  }

  // Sanity CDN URL requires dimensions in path: /<assetId>-<width>x<height>.<format>
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${baseId}-${originalWidth}x${originalHeight}.${format}?${params.toString()}`;
}

// Main component
function SanityImageComponent({
  image,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  loading,
  className,
  style,
  decoding,
  fetchPriority,
}: SanityImageProps) {
  const processedData = processImageData(image);

  if (!processedData) {
    console.debug("SanityImage: Failed to process image data", image);
    return null;
  }

  const { id, preview, hotspot, crop } = processedData;
  const parsed = parseImageId(id);

  // Build the base URL with crop/hotspot params
  const baseUrl = buildSanityUrl(id, width || parsed.width, crop, hotspot);

  // Calculate object position from hotspot
  const objectPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : undefined;

  // Use provided dimensions or fall back to parsed dimensions
  const finalWidth = width || parsed.width;
  const finalHeight = height || parsed.height;

  if (fill) {
    return (
      <Image
        src={baseUrl}
        fill
        alt={alt}
        className={className}
        style={objectPosition ? { ...style, objectPosition } : style}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        unoptimized
        priority={priority}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        {...(preview && { placeholder: "blur", blurDataURL: preview })}
      />
    );
  }

  return (
    <Image
      src={baseUrl}
      width={finalWidth}
      height={finalHeight}
      alt={alt}
      className={className}
      style={objectPosition ? { ...style, objectPosition } : style}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      unoptimized
      priority={priority}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      {...(preview && { placeholder: "blur", blurDataURL: preview })}
    />
  );
}

// Memoized export for performance optimization
export const SanityImage = memo(SanityImageComponent);
