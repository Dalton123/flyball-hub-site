"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle2, LayoutGrid, Users } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType, SanityImageProps } from "@/types";

import { BackgroundPattern } from "../elements/background-pattern";
import { SanityButtons } from "../elements/sanity-buttons";
import { SanityImage } from "../elements/sanity-image";

// Icon mapping for features
const ICON_MAP = {
  users: Users,
  calendar: Calendar,
  layoutGrid: LayoutGrid,
} as const;

// Default feature data (fallback when no Sanity data)
const DEFAULT_FEATURES = [
  {
    _key: "default-1",
    icon: "users" as const,
    title: "Team Management",
    description:
      "Organise your roster, track every dog, and keep member info at your fingertips",
  },
  {
    _key: "default-2",
    icon: "calendar" as const,
    title: "Training & RSVPs",
    description:
      "Schedule sessions in seconds, send reminders, and know exactly who's attending",
  },
  {
    _key: "default-3",
    icon: "layoutGrid" as const,
    title: "Everything in One Place",
    description:
      "Results, times, lineups, and team stats — no more scattered spreadsheets",
  },
];

// Hoisted static styles to prevent recreation on each render
const phoneWrapperStyle = {
  transitionDelay: "400ms",
  perspective: "1000px",
} as const;

const phoneFrameStyle = {
  transform: "rotateY(-5deg) rotateX(2deg)",
  transformStyle: "preserve-3d",
} as const;

const glowStyle = {
  background:
    "radial-gradient(ellipse at center, rgba(168, 230, 60, 0.4) 0%, rgba(168, 230, 60, 0.1) 40%, transparent 70%)",
} as const;

const innerGlowStyle = {
  background:
    "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%)",
} as const;

const noiseTextureStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
} as const;

const radialGlowStyle = {
  background:
    "radial-gradient(ellipse at center, rgba(168, 230, 60, 0.3) 0%, transparent 60%)",
} as const;

// Hoisted static star icon SVG
const starIcon = (
  <svg
    className="w-3 h-3 text-lime-400/80"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Animation delay styles (computed once)
const animationDelays = {
  headline: { transitionDelay: "100ms" } as const,
  description: { transitionDelay: "200ms" } as const,
  cta: { transitionDelay: "1000ms" } as const,
  platform: { transitionDelay: "1100ms" } as const,
};

// Feature item animation delays (computed once)
const featureDelays = [
  { transitionDelay: "600ms" } as const,
  { transitionDelay: "750ms" } as const,
  { transitionDelay: "900ms" } as const,
];

// Hoisted burst ray styles (8 rays at 45deg intervals)
const burstRayStyles = [
  { transform: "translate(-50%, -100%) rotate(0deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(45deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(90deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(135deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(180deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(225deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(270deg) translateY(-12px)" },
  { transform: "translate(-50%, -100%) rotate(315deg) translateY(-12px)" },
] as const;

// Scroll animation hook with reduced motion support
function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    isVisible: prefersReducedMotion ? true : isVisible,
    prefersReducedMotion,
  };
}

// Phone Mockup Component with perspective tilt and floating animation
function PhoneMockup({
  isVisible,
  reduceMotion,
  screenshot,
}: {
  isVisible: boolean;
  reduceMotion: boolean;
  screenshot?: SanityImageProps | null;
}) {
  return (
    <div
      className={cn(
        "relative transition-all duration-1000 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 rotate-0"
          : "opacity-0 translate-y-16 rotate-3"
      )}
      style={phoneWrapperStyle}
    >
      {/* Animated glow effect */}
      <div className="absolute -inset-8 md:-inset-12">
        <div
          className="absolute inset-0 rounded-full blur-3xl animate-pulse-glow"
          style={glowStyle}
        />
        <div
          className="absolute inset-4 rounded-full blur-2xl animate-pulse-glow-delayed"
          style={innerGlowStyle}
        />
      </div>

      {/* Phone frame with subtle 3D perspective and floating animation */}
      <div
        className={cn(
          "relative mx-auto w-[260px] md:w-[280px] lg:w-[300px]",
          !reduceMotion && "animate-float-phone"
        )}
        style={phoneFrameStyle}
      >
        {/* Phone body */}
        <div className="relative rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-b from-gray-800 via-gray-900 to-black p-2.5 md:p-3 shadow-2xl shadow-black/60">
          {/* Side buttons - volume */}
          <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l-sm" />
          <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-700 rounded-l-sm" />
          {/* Side button - power */}
          <div className="absolute -right-1 top-32 w-1 h-16 bg-gray-700 rounded-r-sm" />

          {/* Screen bezel */}
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-black">
            {/* Dynamic Island */}
            {/* <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-[90px] h-[28px] bg-black rounded-full flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800 ring-1 ring-gray-700" />
              </div>
            </div> */}

            {/* Screen content - either Sanity image or default UI mockup */}
            {screenshot?.id ? (
              <div className="relative aspect-[9/19.5] overflow-hidden">
                <SanityImage
                  image={screenshot}
                  alt={screenshot.alt || "Flyball Hub app screenshot"}
                  width={300}
                  height={650}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <DefaultPhoneUI />
            )}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 md:w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Default Phone UI when no screenshot is provided
function DefaultPhoneUI() {
  return (
    <div className="relative aspect-[9/19.5] bg-gradient-to-b from-emerald-900 via-emerald-950 to-gray-950 overflow-hidden">
      {/* App header */}
      <div className="pt-14 px-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] text-emerald-400/70 font-medium tracking-wide uppercase">
              Good Morning
            </div>
            <div className="text-white text-sm font-semibold mt-0.5">
              Thunder Paws FC
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-900">
            TP
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <div className="text-[22px] font-bold text-white">12</div>
            <div className="text-[9px] text-emerald-300/80 font-medium">
              Team Members
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
            <div className="text-[22px] font-bold text-lime-400">8</div>
            <div className="text-[9px] text-emerald-300/80 font-medium">
              Active Dogs
            </div>
          </div>
        </div>

        {/* Next session card */}
        <div className="bg-gradient-to-r from-lime-400/20 to-emerald-400/20 backdrop-blur-sm rounded-2xl p-3.5 border border-lime-400/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-lime-400 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-emerald-900" />
            </div>
            <span className="text-[10px] font-semibold text-lime-400 uppercase tracking-wide">
              Next Training
            </span>
          </div>
          <div className="text-white text-[13px] font-semibold">
            Tuesday, 7:00 PM
          </div>
          <div className="text-emerald-300/70 text-[10px] mt-0.5">
            Main Field • 6 confirmed
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex gap-2">
          {["Dogs", "Schedule", "Results"].map((label) => (
            <div
              key={label}
              className="flex-1 bg-white/5 rounded-xl py-2.5 text-center"
            >
              <div className="text-[9px] text-emerald-300/80 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav hint */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

// Feature type
type FeatureProps = {
  _key: string;
  icon?: keyof typeof ICON_MAP | null;
  title?: string | null;
  description?: string | null;
};

// Feature Item Component
function FeatureItem({
  feature,
  index,
  isVisible,
}: {
  feature: FeatureProps;
  index: number;
  isVisible: boolean;
}) {
  const Icon = ICON_MAP[feature.icon || "users"] || Users;

  return (
    <div
      className={cn(
        "group flex gap-4 items-start transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      )}
      style={featureDelays[index] ?? featureDelays[0]}
    >
      {/* Icon with burst effect */}
      <div className="relative flex-shrink-0">
        {/* Burst rays on hover - using hoisted styles */}
        <div className="absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-500">
          {burstRayStyles.map((style, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-3 bg-lime-400/40 rounded-full origin-bottom"
              style={style}
            />
          ))}
        </div>

        {/* Icon container */}
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-lime-400/25 to-lime-400/5 border border-lime-400/20 flex items-center justify-center group-hover:from-lime-400/40 group-hover:to-lime-400/10 group-hover:border-lime-400/40 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-5 h-5 text-lime-400" strokeWidth={2} />
        </div>
      </div>

      {/* Text content */}
      <div className="pt-0.5">
        <h3 className="font-semibold text-white text-[15px] md:text-base mb-1 group-hover:text-lime-300 transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-emerald-100/70 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

// Props type from Sanity
export type AppPromoBlockProps = PagebuilderType<"appPromo">;

// Main App Promo Component
export function AppPromoBlock({
  eyebrow,
  title,
  highlightedText,
  description,
  features,
  socialProofText,
  showStarRating = true,
  starRating,
  buttons,
  platformNote,
  phoneScreenshot,
}: AppPromoBlockProps) {
  const { ref, isVisible, prefersReducedMotion } = useScrollAnimation(0.1);

  // Use provided features or fall back to defaults
  const displayFeatures =
    features && features.length > 0 ? features : DEFAULT_FEATURES;

  // Parse title with highlighted text
  const renderTitle = () => {
    const displayTitle = title || "Your Flyball Team, In Your Pocket";
    const highlight = highlightedText || "In Your Pocket";

    if (displayTitle.includes(highlight)) {
      const parts = displayTitle.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-300">
              {highlight}
            </span>
            {/* Underline accent */}
            <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400/70 to-transparent rounded-full" />
          </span>
          {parts[1]}
        </>
      );
    }

    return displayTitle;
  };

  return (
    <section
      ref={ref}
      className="py-8"
      aria-labelledby="app-promo-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Main promo container */}
        <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem]">
          {/* Multi-layer gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-[#1a3d2a] to-[#0f261a]" />

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
            style={noiseTextureStyle}
          />

          {/* Paw print pattern */}
          <BackgroundPattern
            pattern="paw-prints"
            opacity={0.04}
            className="text-white"
          />

          {/* Radial glow accent */}
          <div
            className="absolute -top-1/2 -right-1/4 w-full h-full opacity-30"
            style={radialGlowStyle}
          />

          {/* Content wrapper */}
          <div className="relative z-10 px-6 py-12 md:px-10 md:py-16 lg:px-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center">
              {/* Left column - Text content */}
              <div className="max-w-xl">
                {/* Eyebrow badge with social proof */}
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-3 mb-6 transition-all duration-700",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                >
                  <span className="relative overflow-hidden px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-emerald-900 bg-lime-400 rounded-full shadow-lg shadow-lime-400/25">
                    <span className="relative z-10">
                      {eyebrow || "Free to Use"}
                    </span>
                    {/* Shine effect */}
                    <span
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full",
                        !prefersReducedMotion && "animate-shine"
                      )}
                    />
                  </span>
                  {/* Social proof pill */}
                  {socialProofText && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-lime-300/90 bg-white/5 border border-lime-400/20 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                      {socialProofText}
                    </span>
                  )}
                </div>

                {/* Headline */}
                <h2
                  id="app-promo-heading"
                  className={cn(
                    "text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5 transition-all duration-700",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  )}
                  style={animationDelays.headline}
                >
                  {renderTitle()}
                </h2>

                {/* Description */}
                <p
                  className={cn(
                    "text-emerald-100/80 text-base md:text-lg leading-relaxed mb-8 max-w-md transition-all duration-700",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  )}
                  style={animationDelays.description}
                >
                  {description ||
                    "Stop juggling spreadsheets and group chats. Manage training sessions, track attendance, and keep your whole team in sync — from the car park to race day."}
                </p>

                {/* Features list */}
                <div className="space-y-5 mb-10">
                  {displayFeatures.map((feature, index) => (
                    <FeatureItem
                      key={feature._key}
                      feature={feature}
                      index={index}
                      isVisible={isVisible}
                    />
                  ))}
                </div>

                {/* CTAs */}
                <div
                  className={cn(
                    "flex flex-col sm:flex-row gap-4 transition-all duration-700",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  )}
                  style={animationDelays.cta}
                >
                  <SanityButtons
                    buttons={buttons}
                    buttonClassName="px-7 py-3.5 text-[15px] font-semibold rounded-xl"
                  />
                </div>

                {/* Platform availability note */}
                <div
                  className={cn(
                    "flex items-center gap-4 mt-6 transition-all duration-700",
                    isVisible ? "opacity-100" : "opacity-0"
                  )}
                  style={animationDelays.platform}
                >
                  <p className="text-emerald-200/60 text-xs">
                    {platformNote || "Works on any device — web, iOS & Android"}
                  </p>
                  {/* Mini trust indicators - using hoisted star icon */}
                  {showStarRating && (
                    <div
                      className="flex items-center gap-1"
                      aria-label={`${starRating || "4.9"} out of 5 stars rating`}
                    >
                      {starIcon}
                      {starIcon}
                      {starIcon}
                      {starIcon}
                      {starIcon}
                      <span className="text-emerald-200/60 text-xs ml-1">
                        {starRating || "4.9"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Phone mockup */}
              <div className="flex justify-center lg:justify-end">
                <PhoneMockup
                  isVisible={isVisible}
                  reduceMotion={prefersReducedMotion}
                  screenshot={phoneScreenshot}
                />
              </div>
            </div>
          </div>

          {/* Bottom edge gradient */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-400/30 to-transparent" />
        </div>
      </div>

    </section>
  );
}

export default AppPromoBlock;
