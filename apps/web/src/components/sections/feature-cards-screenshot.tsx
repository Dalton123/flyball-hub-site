"use client";

import { Badge } from "@workspace/ui/components/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";
import type { PagebuilderType } from "@/types";
import { cleanText } from "@/utils";

import { RichText } from "../elements/rich-text";
import { SanityImage } from "../elements/sanity-image";

type FeatureCardsScreenshotProps = PagebuilderType<"featureCardsScreenshot">;

type FeatureCardProps = {
  card: NonNullable<FeatureCardsScreenshotProps["cards"]>[number];
  isVisible: boolean;
  index: number;
};

function FeatureCard({ card, isVisible, index }: FeatureCardProps) {
  const { screenshot, title, description, href, openInNewTab } = card ?? {};
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Limit rotation to 15 degrees
    const maxRotation = 15;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotation;
    const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotation;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);

    // Calculate glare position (0-100%)
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  const cardContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 40,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group relative h-full"
    >
      <motion.div
        animate={{
          rotateX: isHovering ? rotateX : 0,
          rotateY: isHovering ? rotateY : 0,
          scale: isHovering ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-primary to-primary/80 shadow-lg h-full"
      >
        {/* Screenshot container */}
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {screenshot ? (
            <SanityImage
              image={screenshot}
              alt={screenshot?.alt || title || "Feature screenshot"}
              width={800}
              height={600}
              className="!h-full w-full object-cover transition-transform duration-500 group-hover:scale-101 !rounded-none"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10">
              <span className="text-muted-foreground">Screenshot</span>
            </div>
          )}

          {/* Holographic glare overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity: isHovering ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Rainbow gradient glare */}
            <div
              className="absolute inset-0 mix-blend-overlay"
              style={{
                background: `
                  radial-gradient(
                    circle at ${glarePosition.x}% ${glarePosition.y}%,
                    rgba(255, 255, 255, 0.4) 0%,
                    rgba(255, 255, 255, 0.2) 20%,
                    transparent 50%
                  )
                `,
              }}
            />

            {/* Holographic shimmer effect */}
            <div
              className="absolute inset-0 mix-blend-color-dodge opacity-30"
              style={{
                background: `
                  linear-gradient(
                    ${45 + (glarePosition.x - 50) * 0.5}deg,
                    transparent 0%,
                    rgba(255, 100, 100, 0.3) 20%,
                    rgba(255, 255, 100, 0.3) 40%,
                    rgba(100, 255, 100, 0.3) 60%,
                    rgba(100, 200, 255, 0.3) 80%,
                    transparent 100%
                  )
                `,
              }}
            />

            {/* Specular highlight */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(
                    ellipse 80% 50% at ${glarePosition.x}% ${glarePosition.y}%,
                    rgba(255, 255, 255, 0.15) 0%,
                    transparent 50%
                  )
                `,
              }}
            />
          </motion.div>

          {/* Border glow on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-t-2xl"
            animate={{
              boxShadow: isHovering
                ? "inset 0 0 30px rgba(var(--secondary-rgb, 133 207 91), 0.15)"
                : "inset 0 0 0px transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="relative p-4 h-full">
          {/* Subtle gradient background */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-accent/10" />

          <div className="relative">
            {title && (
              <h3 className="mb-2 text-lg font-semibold text-primary-foreground md:text-xl">
                {cleanText(title)}
              </h3>
            )}
            {description && (
              <p className="text-sm leading-relaxed text-primary-foreground md:text-base">
                {cleanText(description)}
              </p>
            )}
          </div>
        </div>

        {/* Card edge highlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovering
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(var(--primary-rgb, 66 96 61), 0.1)"
              : "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className="block"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export function FeatureCardsScreenshot({
  eyebrow,
  title,
  richText,
  cards,
}: FeatureCardsScreenshotProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const { containerRef, visibleItems } = useStaggeredAnimation(
    cards?.length ?? 0,
    {
      staggerDelay: 150,
    },
  );

  return (
    <section ref={ref} className="py-4 md:py-8 pb-0! md:-mb-8">
      <div className="container mx-auto">
        {/* Header */}
        <div
          className={`mb-12 flex flex-col items-center text-center transition-all duration-700 px-4 lg:mb-16 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {eyebrow && (
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-sm font-medium"
            >
              {cleanText(eyebrow)}
            </Badge>
          )}
          {title && (
            <h2 className="max-w-3xl text-3xl font-semibold md:text-4xl lg:text-5xl">
              {cleanText(title)}
            </h2>
          )}
          {richText && (
            <RichText
              richText={richText}
              className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg text-center text-pretty"
            />
          )}
        </div>

        {/* Cards grid */}
        <div
          ref={containerRef}
          className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 lg:gap-4 xl:gap-6 px-6"
        >
          {cards?.map((card, index) => (
            <FeatureCard
              key={card?._key || index}
              card={card}
              isVisible={visibleItems[index] ?? false}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
