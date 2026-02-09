"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle2, LayoutGrid, Users } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType, SanityImageProps } from "@/types";
import { cleanText } from "@/utils";
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
  appStoreBadges: { transitionDelay: "1050ms" } as const,
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
                  alt={cleanText(screenshot.alt) || "Flyball Hub app screenshot"}
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

// App Store Badge Components - Using official badge artwork 
// Sources: https://github.com/steverichey/google-play-badge-svg, https://www.svgrepo.com/svg/303128/download-on-the-app-store-apple-logo
function GooglePlayBadge({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900 rounded-lg"
      aria-label="Get it on Google Play"
    >
      <svg
        width="135"
        height="40"
        viewBox="10 10 135 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gp-a" x1="31.8" y1="183.29" x2="15.02" y2="166.51" gradientTransform="matrix(1 0 0 -1 0 202)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00a0ff"/>
            <stop offset=".01" stopColor="#00a1ff"/>
            <stop offset=".26" stopColor="#00beff"/>
            <stop offset=".51" stopColor="#00d2ff"/>
            <stop offset=".76" stopColor="#00dfff"/>
            <stop offset="1" stopColor="#00e3ff"/>
          </linearGradient>
          <linearGradient id="gp-b" x1="43.83" y1="172" x2="19.64" y2="172" gradientTransform="matrix(1 0 0 -1 0 202)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe000"/>
            <stop offset=".41" stopColor="#ffbd00"/>
            <stop offset=".78" stopColor="orange"/>
            <stop offset="1" stopColor="#ff9c00"/>
          </linearGradient>
          <linearGradient id="gp-c" x1="34.83" y1="169.7" x2="12.07" y2="146.95" gradientTransform="matrix(1 0 0 -1 0 202)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff3a44"/>
            <stop offset="1" stopColor="#c31162"/>
          </linearGradient>
          <linearGradient id="gp-d" x1="17.3" y1="191.82" x2="27.46" y2="181.66" gradientTransform="matrix(1 0 0 -1 0 202)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#32a071"/>
            <stop offset=".07" stopColor="#2da771"/>
            <stop offset=".48" stopColor="#15cf74"/>
            <stop offset=".8" stopColor="#06e775"/>
            <stop offset="1" stopColor="#00f076"/>
          </linearGradient>
        </defs>
        <path fill="none" d="M0 0h155v60H0z"/>
        <rect x="10" y="10" width="135" height="40" rx="5" ry="5"/>
        <path d="M140 10.8a4.2 4.2 0 0 1 4.2 4.2v30a4.2 4.2 0 0 1-4.2 4.2H15a4.2 4.2 0 0 1-4.2-4.2V15a4.2 4.2 0 0 1 4.2-4.2h125m0-.8H15a5 5 0 0 0-5 5v30a5 5 0 0 0 5 5h125a5 5 0 0 0 5-5V15a5 5 0 0 0-5-5z" fill="#a6a6a6"/>
        <path d="M57.42 20.24a2.71 2.71 0 0 1-.75 2 2.91 2.91 0 0 1-2.2.89 3.15 3.15 0 0 1-2.21-5.37 3 3 0 0 1 2.21-.9 3.1 3.1 0 0 1 1.23.25 2.47 2.47 0 0 1 .94.67l-.53.53a2 2 0 0 0-1.64-.71 2.32 2.32 0 0 0-2.33 2.4 2.36 2.36 0 0 0 4 1.73 1.89 1.89 0 0 0 .5-1.22h-2.17v-.72h2.91a2.54 2.54 0 0 1 .04.45zM62 17.74h-2.7v1.9h2.46v.72H59.3v1.9H62V23h-3.5v-6H62zM65.28 23h-.77v-5.26h-1.68V17h4.12v.74h-1.72zM69.94 23v-6h.77v6zM74.13 23h-.77v-5.26h-1.68V17h4.12v.74h-1.67zM83.61 22.22a3.12 3.12 0 0 1-4.4 0 3.24 3.24 0 0 1 0-4.45 3.1 3.1 0 0 1 4.4 0 3.23 3.23 0 0 1 0 4.45zm-3.83-.5a2.31 2.31 0 0 0 3.26 0 2.56 2.56 0 0 0 0-3.44 2.31 2.31 0 0 0-3.26 0 2.56 2.56 0 0 0 0 3.44zM85.58 23v-6h.94l2.92 4.67V17h.77v6h-.8l-3.05-4.89V23z" fill="#fff" stroke="#fff" strokeMiterlimit="10" strokeWidth=".2"/>
        <path d="M78.14 31.75A4.25 4.25 0 1 0 82.41 36a4.19 4.19 0 0 0-4.27-4.25zm0 6.83a2.58 2.58 0 1 1 2.4-2.58 2.46 2.46 0 0 1-2.4 2.58zm-9.31-6.83A4.25 4.25 0 1 0 73.09 36a4.19 4.19 0 0 0-4.27-4.25zm0 6.83A2.58 2.58 0 1 1 71.22 36a2.46 2.46 0 0 1-2.4 2.58zm-11.09-5.52v1.8h4.32a3.77 3.77 0 0 1-1 2.27 4.42 4.42 0 0 1-3.33 1.32 4.8 4.8 0 0 1 0-9.6A4.6 4.6 0 0 1 61 30.14l1.27-1.27A6.29 6.29 0 0 0 57.74 27a6.61 6.61 0 1 0 0 13.21 6 6 0 0 0 4.61-1.85 6 6 0 0 0 1.56-4.22 5.87 5.87 0 0 0-.1-1.13zm45.31 1.4a4 4 0 0 0-3.64-2.71 4 4 0 0 0-4 4.25 4.16 4.16 0 0 0 4.22 4.25 4.23 4.23 0 0 0 3.54-1.88l-1.45-1a2.43 2.43 0 0 1-2.09 1.18 2.16 2.16 0 0 1-2.06-1.29l5.69-2.35zm-5.8 1.42a2.33 2.33 0 0 1 2.22-2.48 1.65 1.65 0 0 1 1.58.9zM92.63 40h1.87V27.5h-1.87zm-3.06-7.3h-.07a3 3 0 0 0-2.24-1 4.26 4.26 0 0 0 0 8.51 2.9 2.9 0 0 0 2.24-1h.06v.61c0 1.63-.87 2.5-2.27 2.5a2.35 2.35 0 0 1-2.14-1.51l-1.63.68A4.05 4.05 0 0 0 87.29 44c2.19 0 4-1.29 4-4.43V32h-1.72zm-2.14 5.88a2.59 2.59 0 0 1 0-5.16A2.4 2.4 0 0 1 89.7 36a2.38 2.38 0 0 1-2.28 2.58zm24.38-11.08h-4.47V40h1.87v-4.74h2.61a3.89 3.89 0 1 0 0-7.76zm0 6h-2.61v-4.26h2.65a2.14 2.14 0 1 1 0 4.29zm11.53-1.8a3.5 3.5 0 0 0-3.33 1.91l1.66.69a1.77 1.77 0 0 1 1.7-.92 1.8 1.8 0 0 1 2 1.61v.13a4.13 4.13 0 0 0-1.95-.48c-1.79 0-3.6 1-3.6 2.81a2.89 2.89 0 0 0 3.1 2.75 2.63 2.63 0 0 0 2.4-1.2h.06v1h1.8v-4.81c0-2.19-1.66-3.46-3.79-3.46zm-.23 6.85c-.61 0-1.46-.31-1.46-1.06 0-1 1.06-1.33 2-1.33a3.32 3.32 0 0 1 1.7.42 2.26 2.26 0 0 1-2.19 2zM133.74 32l-2.14 5.42h-.06L129.32 32h-2l3.33 7.58-1.9 4.21h1.95L135.82 32zm-16.81 8h1.87V27.5h-1.87z" fill="#fff"/>
        <path d="M20.44 17.54a2 2 0 0 0-.46 1.4v22.12a2 2 0 0 0 .46 1.4l.07.07L32.9 30.15v-.29L20.51 17.47z" fill="url(#gp-a)"/>
        <path d="M37 34.28l-4.1-4.13v-.29l4.1-4.14.09.05L42 28.56c1.4.79 1.4 2.09 0 2.89l-4.89 2.78z" fill="url(#gp-b)"/>
        <path d="M37.12 34.22L32.9 30 20.44 42.46a1.63 1.63 0 0 0 2.08.06l14.61-8.3" fill="url(#gp-c)"/>
        <path d="M37.12 25.78l-14.61-8.3a1.63 1.63 0 0 0-2.08.06L32.9 30z" fill="url(#gp-d)"/>
        <path d="M37 34.13l-14.49 8.25a1.67 1.67 0 0 1-2 0l-.07.07.07.07a1.66 1.66 0 0 0 2 0l14.61-8.3z" opacity=".2"/>
        <path d="M20.44 42.32a2 2 0 0 1-.46-1.4v.15a2 2 0 0 0 .46 1.4l.07-.07zM42 31.3l-5 2.83.09.09L42 31.44A1.75 1.75 0 0 0 43 30a1.86 1.86 0 0 1-1 1.3z" opacity=".12"/>
        <path d="M22.51 17.62L42 28.7a1.86 1.86 0 0 1 1 1.3 1.75 1.75 0 0 0-1-1.44L22.51 17.48c-1.4-.79-2.54-.13-2.54 1.47v.15c.03-1.61 1.15-2.27 2.54-1.48z" fill="#fff" opacity=".25"/>
      </svg>
    </a>
  );
}

function AppStoreBadge({
  url,
  comingSoon,
}: {
  url?: string | null;
  comingSoon?: boolean;
}) {
  const isDisabled = comingSoon || !url;

  const badge = (
    <span
      className={cn(
        "inline-flex flex-col items-center",
        isDisabled && "cursor-not-allowed"
      )}
    >
      <svg
        width="135"
        height="40"
        viewBox="0 0 135 40"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        className={cn(isDisabled && "opacity-50 grayscale")}
      >
        <path fill="#a6a6a6" d="M130.2 40H4.7A4.7 4.7 0 0 1 0 35.3V4.7A4.7 4.7 0 0 1 4.7 0h125.5a4.7 4.7 0 0 1 4.7 4.7v30.5a4.7 4.7 0 0 1-4.7 4.8z"/>
        <path d="M134 35.3a3.8 3.8 0 0 1-3.8 3.8H4.7a3.8 3.8 0 0 1-3.8-3.8V4.7A3.8 3.8 0 0 1 4.7.9h125.5a3.8 3.8 0 0 1 3.8 3.8v30.6z"/>
        <g fill="#fff">
          <path d="M30.1 19.8a5 5 0 0 1 2.4-4.2 5.1 5.1 0 0 0-4-2.1c-1.7-.2-3.3 1-4.2 1s-2.2-1-3.6-1a5.3 5.3 0 0 0-4.5 2.7c-1.9 3.3-.5 8.3 1.4 11 .9 1.3 2 2.8 3.4 2.8 1.4-.1 1.9-.9 3.6-.9s2.1.9 3.6.9 2.4-1.4 3.3-2.7a11 11 0 0 0 1.5-3 4.8 4.8 0 0 1-2.9-4.5zM27.4 11.5a4.4 4.4 0 0 0 1-3.2 4.5 4.5 0 0 0-2.9 1.5 4.2 4.2 0 0 0-1 3 3.7 3.7 0 0 0 2.9-1.3z"/>
        </g>
        <g fill="#fff">
          <path d="M53.7 31.5h-2.3l-1.2-3.9h-4.3l-1.2 3.9h-2.2l4.3-13.3h2.6zm-3.9-5.6l-1.1-3.5c-.1-.4-.3-1.2-.7-2.5h0c-.1.6-.3 1.4-.6 2.5l-1.1 3.5zM64.7 26.6c0 1.6-.4 2.9-1.3 3.9-.8.8-1.8 1.3-3 1.3-1.3 0-2.2-.5-2.7-1.4v5h-2.1V25c0-1 0-2.1-.1-3.2h1.9l.1 1.5h0a3.3 3.3 0 0 1 3.2-1.7c1.1 0 2.1.4 2.8 1.3.8.9 1.2 2.1 1.2 3.6zm-2.2.1c0-.9-.2-1.7-.6-2.3-.5-.6-1.1-.9-1.9-.9-.5 0-1 .2-1.4.5-.4.4-.7.8-.8 1.4a2.8 2.8 0 0 0-.1.6v1.6c0 .7.2 1.3.6 1.8.4.5 1 .7 1.7.7.8 0 1.4-.3 1.9-.9.4-.6.7-1.4.7-2.4zM75.7 26.6c0 1.6-.4 2.9-1.3 3.9-.8.8-1.8 1.3-3 1.3-1.3 0-2.2-.5-2.7-1.4v5H66.6V25c0-1 0-2.1-.1-3.2h1.9l.1 1.5h0a3.3 3.3 0 0 1 3.2-1.7c1.1 0 2.1.4 2.8 1.3.8.9 1.1 2.1 1.1 3.6zm-2.2.1c0-.9-.2-1.7-.6-2.3-.5-.6-1.1-.9-1.9-.9-.5 0-1 .2-1.4.5-.4.4-.7.8-.8 1.4a2.8 2.8 0 0 0-.1.6v1.6c0 .7.2 1.3.6 1.8.4.5 1 .7 1.7.7.8 0 1.4-.3 1.9-.9.4-.6.7-1.4.7-2.4zM88 27.8c0 1.1-.4 2.1-1.2 2.8-.9.8-2.1 1.2-3.6 1.2-1.4 0-2.6-.3-3.4-.8l.5-1.8c1 .6 2 .8 3.1.8.8 0 1.4-.2 1.9-.5.4-.4.7-.8.7-1.5 0-.5-.2-1-.6-1.4-.4-.4-1-.7-1.8-1-2.3-.9-3.5-2.1-3.5-3.8 0-1.1.4-2 1.2-2.7.8-.7 1.9-1 3.3-1 1.2 0 2.2.2 3 .6l-.5 1.7c-.8-.4-1.6-.6-2.6-.6-.8 0-1.3.2-1.8.6-.4.3-.5.7-.5 1.2 0 .5.2 1 .6 1.3.4.3 1 .7 1.9 1 1.1.5 2 1 2.5 1.6.5.6.8 1.4.8 2.3zM95.1 23.5h-2.4v4.7c0 1.2.4 1.8 1.2 1.8.4 0 .7 0 .9-.1l.1 1.6c-.4.2-1 .2-1.7.2-.8 0-1.5-.3-2-.8s-.7-1.4-.7-2.6v-4.8h-1.4v-1.6h1.4v-1.8l2.1-.6v2.4h2.4zM105.7 26.6c0 1.5-.4 2.7-1.3 3.6-.9 1-2.1 1.5-3.5 1.5-1.4 0-2.5-.5-3.4-1.4-.8-.9-1.3-2.1-1.3-3.5 0-1.5.4-2.7 1.3-3.7.9-.9 2-1.4 3.5-1.4 1.4 0 2.5.5 3.4 1.4.8.9 1.2 2.1 1.2 3.5zm-2.2 0c0-.9-.2-1.6-.6-2.3-.4-.8-1.1-1.1-1.9-1.1-.9 0-1.5.4-2 1.1-.4.6-.6 1.4-.6 2.3 0 .9.2 1.6.6 2.3.5.8 1.1 1.1 1.9 1.1.8 0 1.5-.4 1.9-1.2.4-.6.6-1.4.6-2.3zM112.6 23.8a3.7 3.7 0 0 0-.7-.1c-.7 0-1.3.3-1.7.8-.4.5-.5 1.1-.5 1.9v5h-2.1V25c0-1 0-1.9-.1-3h1.9l.1 1.8h.1c.2-.6.6-1.1 1.1-1.5a2.6 2.6 0 0 1 1.5-.5c.2 0 .4 0 .5 0zM122.2 26.3c0 .4-.1.7-.1 1h-6.4c0 .9.3 1.7.9 2.2.5.4 1.2.7 2.1.7.9 0 1.8-.2 2.6-.5l.3 1.5c-.9.4-2 .6-3.2.6-1.5 0-2.7-.4-3.5-1.3s-1.3-2.1-1.3-3.5c0-1.4.4-2.7 1.2-3.6.8-1 1.9-1.5 3.4-1.5 1.4 0 2.4.5 3.1 1.5.6.8.8 1.8.8 3zM120.2 25.7c0-.6-.1-1.2-.4-1.6-.4-.6-.9-.9-1.7-.9-.7 0-1.3.3-1.7.9-.4.5-.6 1-.6 1.7z"/>
        </g>
        <g fill="#fff">
          <path d="M45.2 13.5c-.6 0-1.1 0-1.5-.1V7a11.6 11.6 0 0 1 1.8-.1c2.4 0 3.6 1.2 3.6 3.2 0 2.3-1.3 3.5-3.8 3.5zm.4-5.8c-.3 0-.6 0-.8.1v4.9c.1 0 .4 0 .7 0 1.6 0 2.5-.9 2.5-2.6 0-1.5-.8-2.4-2.4-2.4zM52.6 13.5c-1.4 0-2.3-1-2.3-2.4 0-1.5.9-2.5 2.3-2.5 1.4 0 2.3 1 2.3 2.4 0 1.5-.9 2.5-2.3 2.5zm0-4.2c-.8 0-1.2.7-1.2 1.7 0 1 .5 1.7 1.2 1.7s1.2-.8 1.2-1.7c0-1-.5-1.7-1.2-1.7zM62.8 8.7l-1.5 4.7h-1l-.6-2a15.5 15.5 0 0 1-.4-1.5h0c-.1.5-.2 1-.4 1.5l-.6 2h-1l-1.4-4.7h1.1l.5 2.2c.1.5.2 1 .3 1.5h0c.1-.4.2-.9.4-1.5l.7-2.3h.9l.6 2.2c.2.5.3 1.1.4 1.6h0c.1-.5.2-1 .3-1.6l.6-2.2zM68.2 13.4h-1v-2.7c0-.8-.3-1.3-.9-1.3-.6 0-1 .5-1 1.2v2.8h-1v-3.4c0-.4 0-.9 0-1.3h.9l0 .7h0c.3-.5.9-.8 1.5-.8 1 0 1.6.8 1.6 2zM71.1 13.4h-1V6.6h1zM74.9 13.5c-1.4 0-2.3-1-2.3-2.4 0-1.5.9-2.5 2.3-2.5 1.4 0 2.3 1 2.3 2.4 0 1.5-.9 2.5-2.3 2.5zm0-4.2c-.8 0-1.2.7-1.2 1.7 0 1 .5 1.7 1.2 1.7s1.2-.8 1.2-1.7c0-1-.5-1.7-1.2-1.7zM81.4 13.4l-.1-.5h0c-.3.4-.8.6-1.4.6-.8 0-1.4-.6-1.4-1.4 0-1.2 1-1.8 2.8-1.8v-.1c0-.6-.3-.9-1-.9-.5 0-.9.1-1.2.4l-.2-.7c.4-.3 1-.4 1.6-.4 1.2 0 1.9.7 1.9 2v1.7c0 .5 0 .8.1 1.1zm-.1-2.3c-1.2 0-1.7.3-1.7 1 0 .5.3.7.7.7.5 0 1-.4 1-1zM87.4 13.4l0-.8h0a2 2 0 0 1-1.5.9 2.4 2.4 0 0 1-2-2.4c0-1.5.9-2.5 2.1-2.5.6 0 1.1.2 1.3.6h0V6.6h1v5.6c0 .5 0 .9 0 1.3zm-.2-2.8c0-.7-.4-1.2-1.1-1.2-.8 0-1.3.7-1.3 1.7 0 .9.5 1.6 1.2 1.6.7 0 1.1-.6 1.1-1.3zM94.9 13.5c-1.4 0-2.3-1-2.3-2.4 0-1.5.9-2.5 2.3-2.5 1.4 0 2.3 1 2.3 2.4 0 1.5-.9 2.5-2.3 2.5zm0-4.2c-.8 0-1.2.7-1.2 1.7 0 1 .5 1.7 1.2 1.7s1.2-.8 1.2-1.7c0-1-.5-1.7-1.2-1.7zM102.9 13.4h-1v-2.7c0-.8-.3-1.3-.9-1.3-.6 0-1 .5-1 1.2v2.8h-1v-3.4c0-.4 0-.9 0-1.3h.9l0 .7h0c.3-.5.9-.8 1.5-.8 1 0 1.6.8 1.6 2zM109.9 9.5h-1.2v2.3c0 .6.2.9.6.9.2 0 .3 0 .5 0l0 .8c-.2.1-.5.1-.8.1-.8 0-1.3-.5-1.3-1.7V9.5h-.7v-.8h.7v-.9l1-.3v1.2h1.2zM115.5 13.4h-1v-2.7c0-.8-.3-1.3-.9-1.3-.5 0-1 .4-1 1.1v2.8h-1V6.6h1v2.8h0c.3-.5.8-.8 1.4-.8 1 0 1.6.8 1.6 2zM121.2 11.3h-3.1c0 .9.6 1.4 1.5 1.4.5 0 .9-.1 1.3-.2l.2.7c-.4.2-1 .3-1.6.3-1.5 0-2.3-.9-2.3-2.4 0-1.4.9-2.5 2.2-2.5 1.2 0 2 .9 2 2.2 0 .2 0 .3 0 .5zm-1-.7c0-.7-.4-1.2-1-1.2-.6 0-1.1.5-1.1 1.2z"/>
        </g>
      </svg>
      {comingSoon && (
        <span className="text-[10px] text-emerald-200/60 mt-1">Coming Soon</span>
      )}
    </span>
  );

  if (isDisabled) {
    return badge;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900 rounded-lg"
      aria-label="Download on the App Store"
    >
      {badge}
    </a>
  );
}

// App Store Badges Container Component
function AppStoreBadges({
  googlePlayUrl,
  appStoreUrl,
  appStoreComingSoon,
  isVisible,
}: {
  googlePlayUrl?: string | null;
  appStoreUrl?: string | null;
  appStoreComingSoon?: boolean | null;
  isVisible: boolean;
}) {
  const hasGooglePlay = !!googlePlayUrl;
  const hasAppStore = !!appStoreUrl || appStoreComingSoon;

  if (!hasGooglePlay && !hasAppStore) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-3 mt-6 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={animationDelays.appStoreBadges}
    >
      {hasGooglePlay && <GooglePlayBadge url={googlePlayUrl!} />}
      {hasAppStore && (
        <AppStoreBadge url={appStoreUrl} comingSoon={!!appStoreComingSoon} />
      )}
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
  showAppStoreButtons,
  googlePlayUrl,
  appStoreUrl,
  appStoreComingSoon,
}: AppPromoBlockProps) {
  const { ref, isVisible, prefersReducedMotion } = useScrollAnimation(0.1);

  // Use provided features or fall back to defaults
  const displayFeatures =
    features && features.length > 0 ? features : DEFAULT_FEATURES;

  // Parse title with highlighted text
  const renderTitle = () => {
    const displayTitle = cleanText(title) || "Your Flyball Team, In Your Pocket";
    const highlight = cleanText(highlightedText) || "In Your Pocket";

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

                {/* App Store Badges */}
                {showAppStoreButtons && (
                  <AppStoreBadges
                    googlePlayUrl={googlePlayUrl}
                    appStoreUrl={appStoreUrl}
                    appStoreComingSoon={appStoreComingSoon}
                    isVisible={isVisible}
                  />
                )}

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
