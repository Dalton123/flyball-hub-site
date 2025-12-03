"use client";

import React, { useEffect, useRef, useState } from "react";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

import { Badge } from "@workspace/ui/components/badge";
import type { PagebuilderType } from "@/types";
import { SanityImage } from "../elements/sanity-image";

type MacbookScrollProps = PagebuilderType<"macbookScroll">;

// Laptop dimensions in rem
const LID_HEIGHT_REM = 12;
const BASE_HEIGHT_REM = 22;
const LAPTOP_WIDTH_REM = 32;
const LAPTOP_TOTAL_HEIGHT_REM = LID_HEIGHT_REM + BASE_HEIGHT_REM; // 34rem

// Get scale factor based on breakpoint
const getScaleFactor = () => {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth < 640) return 0.35;
  if (window.innerWidth < 768) return 0.5;
  return 1;
};

export function MacbookScroll({
  eyebrow,
  title,
  description,
  screenImage,
  showGradient,
}: MacbookScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("150vh");
  const [scaleFactor, setScaleFactor] = useState(1);

  // Make offset responsive - start animation earlier on mobile
  // since users scroll through the component faster
  const { scrollYProgress } = useScroll({
    target: ref,
    offset:
      scaleFactor < 0.5
        ? ["start 0.45", "end start"] // Mobile:
        : ["start 0.55", "end start"], // Desktop:
  });

  // Track scale factor for responsive animations
  useEffect(() => {
    const updateScale = () => setScaleFactor(getScaleFactor());
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Calculate dynamic container height based on image size and scale
  useEffect(() => {
    const calculateHeight = () => {
      const sf = getScaleFactor();
      const laptopHeightPx = LAPTOP_TOTAL_HEIGHT_REM * 16 * sf;
      const imageHeight = imageContainerRef.current?.offsetHeight || 300;
      const textHeight = 200;
      const paddingTop = window.innerWidth >= 768 ? 320 : 80;
      const buffer = scaleFactor < 0.5 ? 150 : 0;

      const totalHeight =
        paddingTop + textHeight + laptopHeightPx + imageHeight + buffer;
      setContainerHeight(`${totalHeight}px`);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [screenImage]);

  // Animation transforms
  // Lid opens in first 30% of scroll
  const rotate = useTransform(scrollYProgress, [0, 0.12, 0.3], [-28, -28, 0]);

  // Text fades out quickly
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Scaled laptop height for animation calculations
  const scaledLaptopHeight = LAPTOP_TOTAL_HEIGHT_REM * 16 * scaleFactor;

  // Calculate initial top position based on scale factor
  // Desktop: image starts at top of lid area
  // Mobile/Tablet: adjust for scaled laptop
  const getImageTop = () => {
    if (scaleFactor < 0.5) return 4; // Mobile: ~4px
    if (scaleFactor < 1) return 8; // Tablet: ~8px
    return 0; // Desktop: 8px (0.5rem)
  };

  // Responsive initial transform values
  // Mobile needs different values to fit the smaller scaled laptop
  const initialScaleX = scaleFactor < 0.5 ? 0.7 : 1.2;
  const initialScaleY = scaleFactor < 0.5 ? 0.25 : 0.6;
  const initialRotateX = scaleFactor < 0.5 ? -40 : -34;
  // Responsive keyframes - animation happens earlier on mobile
  // since users scroll through the component faster
  const scaleKeyframes = scaleFactor < 0.5 ? [0, 0.15, 0.4] : [0, 0.3, 0.6];
  const rotateKeyframes = scaleFactor < 0.5 ? [0, 0.08, 0.2] : [0, 0.12, 0.3];
  const translateKeyframes = scaleFactor < 0.5 ? [0, 0.4] : [0.15, 0.6];

  // Image animation - Aceternity style 3D transforms
  // scaleX: starts wider (or narrower on mobile), ends at final scale
  const imageScaleX = useTransform(scrollYProgress, scaleKeyframes, [
    initialScaleX,
    initialScaleX,
    scaleFactor < 1 ? 0.8 : 1.5,
  ]);

  // scaleY: starts compressed to look like it's tilted back, ends at final scale
  const imageScaleY = useTransform(scrollYProgress, scaleKeyframes, [
    initialScaleY,
    initialScaleY * 1.3,
    scaleFactor < 1 ? 0.8 : 1.5,
  ]);

  // rotateX: starts tilted back to match lid, ends flat (0)
  const imageRotateX = useTransform(scrollYProgress, rotateKeyframes, [
    initialRotateX,
    initialRotateX,
    0,
  ]);

  // Image moves down past the scaled laptop
  // Mobile needs more movement to clear the laptop and flow into page
  const translateEndValue =
    scaleFactor < 0.5
      ? scaledLaptopHeight + 200 // More movement on mobile
      : scaledLaptopHeight + 200;

  const imageTranslateY = useTransform(scrollYProgress, translateKeyframes, [
    0,
    translateEndValue,
  ]);

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-start "
      style={{ minHeight: containerHeight }}
    >
      {/* Text content - fades out on scroll */}
      <motion.div
        style={{
          opacity: textOpacity,
          translateY: textTranslateY,
        }}
        className="mb-20 flex flex-col items-center text-center px-4"
      >
        {eyebrow && (
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm font-medium"
          >
            {eyebrow}
          </Badge>
        )}
        {title && (
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </motion.div>

      {/* Laptop + Image Container */}
      <div className="relative flex flex-col items-center perspective-[800px]">
        {/* Scaled Laptop Container (lid + base only) */}
        <div className="relative scale-50 sm:scale-50 md:scale-100 origin-top [perspective:800px]">
          {/* Lid (frame only, no image) */}
          <Lid rotate={rotate} />

          {/* Base */}
          <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
            {/* above keyboard bar */}
            <div className="relative h-10 w-full">
              <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
            </div>
            <div className="relative flex">
              <div className="mx-auto h-full w-[10%] overflow-hidden">
                <SpeakerGrid />
              </div>
              <div className="mx-auto h-full w-[80%]">
                <Keypad />
              </div>
              <div className="mx-auto h-full w-[10%] overflow-hidden">
                <SpeakerGrid />
              </div>
            </div>
            <Trackpad />
            <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
            {showGradient && (
              <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
            )}
          </div>
        </div>

        {/* Screen Image - OUTSIDE scaled container, responsive sizing */}
        <motion.div
          ref={imageContainerRef}
          style={{
            top: getImageTop(),
            scaleX: imageScaleX,
            scaleY: imageScaleY,
            rotateX: imageRotateX,
            translateY: imageTranslateY,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
          className="absolute left-1/2 -translate-x-1/2 z-20 w-[85%] sm:w-[55%] md:w-[32rem]"
        >
          {screenImage ? (
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <SanityImage
                image={screenImage}
                width={1920}
                height={1200}
                className="w-full h-auto object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[16/10] w-full rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-2xl">
              <span className="text-muted-foreground">App Screenshot</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Lid({ rotate }: { rotate: MotionValue<number> }) {
  return (
    <div className="relative [perspective:800px]">
      {/* Static lid background (shows when closed) */}
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="text-white">{/* Logo placeholder */}</span>
        </div>
      </div>

      {/* Animated lid overlay (opens with rotation) */}
      <motion.div
        style={{
          rotateX: rotate,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom",
        }}
        className="absolute inset-0 h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        {/* Screen bezel */}
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        {/* Empty screen area - image is rendered separately */}
        <div className="absolute inset-2 rounded-md bg-black/50" />
      </motion.div>
    </div>
  );
}

function Trackpad() {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    />
  );
}

function Keypad() {
  return (
    <div className="mx-1 h-full rounded-md bg-[#050505] p-1 [transform:translateZ(0)] [will-change:transform]">
      {/* First Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F9</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </div>

      {/* Second row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn>
          <span className="block">~</span>
          <span className="mt-1 block">`</span>
        </KBtn>
        <KBtn>
          <span className="block">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn>
          <span className="block">&mdash;</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn
          className="w-10 items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          delete
        </KBtn>
      </div>

      {/* Third row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          tab
        </KBtn>
        <KBtn>
          <span className="block">Q</span>
        </KBtn>
        <KBtn>
          <span className="block">W</span>
        </KBtn>
        <KBtn>
          <span className="block">E</span>
        </KBtn>
        <KBtn>
          <span className="block">R</span>
        </KBtn>
        <KBtn>
          <span className="block">T</span>
        </KBtn>
        <KBtn>
          <span className="block">Y</span>
        </KBtn>
        <KBtn>
          <span className="block">U</span>
        </KBtn>
        <KBtn>
          <span className="block">I</span>
        </KBtn>
        <KBtn>
          <span className="block">O</span>
        </KBtn>
        <KBtn>
          <span className="block">P</span>
        </KBtn>
        <KBtn>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[2.8rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          caps lock
        </KBtn>
        <KBtn>
          <span className="block">A</span>
        </KBtn>
        <KBtn>
          <span className="block">S</span>
        </KBtn>
        <KBtn>
          <span className="block">D</span>
        </KBtn>
        <KBtn>
          <span className="block">F</span>
        </KBtn>
        <KBtn>
          <span className="block">G</span>
        </KBtn>
        <KBtn>
          <span className="block">H</span>
        </KBtn>
        <KBtn>
          <span className="block">J</span>
        </KBtn>
        <KBtn>
          <span className="block">K</span>
        </KBtn>
        <KBtn>
          <span className="block">L</span>
        </KBtn>
        <KBtn>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.85rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[3.65rem] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          shift
        </KBtn>
        <KBtn>
          <span className="block">Z</span>
        </KBtn>
        <KBtn>
          <span className="block">X</span>
        </KBtn>
        <KBtn>
          <span className="block">C</span>
        </KBtn>
        <KBtn>
          <span className="block">V</span>
        </KBtn>
        <KBtn>
          <span className="block">B</span>
        </KBtn>
        <KBtn>
          <span className="block">N</span>
        </KBtn>
        <KBtn>
          <span className="block">M</span>
        </KBtn>
        <KBtn>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[3.65rem] items-end justify-end pr-[4px] pb-[2px]"
          childrenClassName="items-end"
        >
          shift
        </KBtn>
      </div>

      {/* Sixth Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex w-full justify-start pl-1">
            <IconWorld className="h-[6px] w-[6px]" />
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <IconChevronUp className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">control</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-end pr-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
        >
          <div className="flex w-full justify-end pr-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="w-[8.2rem]" />
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[4px]"
        >
          <div className="flex w-full justify-start pl-1">
            <IconCommand className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">command</span>
          </div>
        </KBtn>
        <KBtn className="" childrenClassName="h-full justify-between py-[4px]">
          <div className="flex w-full justify-start pl-1">
            <OptionKey className="h-[6px] w-[6px]" />
          </div>
          <div className="flex w-full justify-start pl-1">
            <span className="block">option</span>
          </div>
        </KBtn>
        <div className="mt-[2px] flex h-6 w-[4.9rem] flex-col items-center justify-end rounded-[4px] p-[0.5px]">
          <KBtn className="h-3 w-6">
            <IconCaretUpFilled className="h-[6px] w-[6px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="h-3 w-6">
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <KBtn className="h-3 w-6">
              <IconCaretRightFilled className="h-[6px] w-[6px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function KBtn({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[4px] p-[0.5px] [transform:translateZ(0)] [will-change:transform]",
        backlit && "bg-white/[0.2] shadow-xl shadow-white",
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]",
          className,
        )}
        style={{
          boxShadow:
            "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center text-[5px] text-neutral-200",
            childrenClassName,
            backlit && "text-white",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SpeakerGrid() {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    />
  );
}

function OptionKey({ className }: { className: string }) {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
}
