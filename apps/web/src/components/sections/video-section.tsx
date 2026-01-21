"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { cleanText } from "@/utils";
import { SanityImage } from "../elements/sanity-image";

export type VideoSectionProps = PagebuilderType<"videoSection">;

/**
 * Extract video ID and platform from YouTube or Vimeo URL
 */
function parseVideoUrl(url: string): {
  platform: "youtube" | "vimeo" | null;
  id: string | null;
} {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return { platform: "youtube", id: match[1] };
    }
  }

  // Vimeo patterns
  const vimeoPattern = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoPattern);
  if (vimeoMatch?.[1]) {
    return { platform: "vimeo", id: vimeoMatch[1] };
  }

  return { platform: null, id: null };
}

export function VideoSection({
  eyebrow,
  title,
  description,
  videoUrl,
  posterImage,
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { platform, id } = videoUrl
    ? parseVideoUrl(videoUrl)
    : { platform: null, id: null };

  if (!platform || !id) {
    return null;
  }

  const embedUrl =
    platform === "youtube"
      ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${id}?autoplay=1`;

  return (
    <section className="py-8 md:py-12 bg-primary/70">
      <div className="container mx-auto px-4 xl:px-0">
        {/* Header */}
        {(eyebrow || title || description) && (
          <div className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-1.5 text-sm font-medium"
              >
                {cleanText(eyebrow)}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-balance">
                {cleanText(title)}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                {cleanText(description)}
              </p>
            )}
          </div>
        )}

        {/* Video Container */}
        <div className="relative aspect-video w-full  mx-auto overflow-hidden rounded-xl shadow-2xl bg-black">
          {!isPlaying && posterImage?.id ? (
            // Poster image with play button
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative w-full h-full cursor-pointer"
              aria-label="Play video"
            >
              <SanityImage
                image={posterImage}
                className="!h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 !rounded-none"
                width={1280}
                height={720}
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                  <Play
                    className="h-8 w-8 text-primary ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>
            </button>
          ) : !isPlaying ? (
            // No poster - show play button over embed thumbnail
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative w-full h-full cursor-pointer bg-gray-900"
              aria-label="Play video"
            >
              {platform === "youtube" && (
                <img
                  src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                  <Play
                    className="h-8 w-8 text-primary ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>
            </button>
          ) : (
            // Playing - show iframe
            <iframe
              src={embedUrl}
              title={title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
