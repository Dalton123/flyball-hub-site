import { cn } from "@workspace/ui/lib/utils";

type PatternType = "tennis-balls" | "paw-prints" | "dots";

interface BackgroundPatternProps {
  pattern?: PatternType;
  opacity?: number;
  className?: string;
}

function TennisBallsPattern() {
  // Scattered tennis balls pattern using inline SVG
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="tennis-balls-pattern"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          {/* Tennis ball at different positions */}
          <g fill="currentColor">
            <circle cx="30" cy="30" r="12" />
            <path
              d="M22 24c2 2 2 10 0 12M38 24c-2 2-2 10 0 12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
          <g fill="currentColor" transform="translate(80, 70)">
            <circle cx="0" cy="0" r="10" />
            <path
              d="M-6 -5c1.5 1.5 1.5 8 0 10M6 -5c-1.5 1.5-1.5 8 0 10"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tennis-balls-pattern)" />
    </svg>
  );
}

function PawPrintsPattern() {
  // a Diagonal paw print pattern
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="paw-prints-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {/* Single paw print */}
          <g fill="currentColor" transform="translate(25, 25) rotate(-30)">
            {/* Main pad */}
            <ellipse cx="0" cy="4" rx="5" ry="4.5" />
            {/* Toes */}
            <ellipse cx="-5" cy="-4" rx="2.5" ry="3" />
            <ellipse cx="5" cy="-4" rx="2.5" ry="3" />
            <ellipse cx="-2.5" cy="-8" rx="2.2" ry="2.8" />
            <ellipse cx="2.5" cy="-8" rx="2.2" ry="2.8" />
          </g>
          {/* Second paw print offset */}
          <g fill="currentColor" transform="translate(70, 70) rotate(-30)">
            <ellipse cx="0" cy="4" rx="4" ry="3.5" />
            <ellipse cx="-4" cy="-3" rx="2" ry="2.5" />
            <ellipse cx="4" cy="-3" rx="2" ry="2.5" />
            <ellipse cx="-2" cy="-6.5" rx="1.8" ry="2.2" />
            <ellipse cx="2" cy="-6.5" rx="1.8" ry="2.2" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#paw-prints-pattern)" />
    </svg>
  );
}

function DotsPattern() {
  // Simple dot grid pattern
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dots-pattern"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-pattern)" />
    </svg>
  );
}

export function BackgroundPattern({
  pattern = "dots",
  opacity = 0.05,
  className,
}: BackgroundPatternProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none text-primary overflow-hidden",
        className,
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      {pattern === "tennis-balls" && <TennisBallsPattern />}
      {pattern === "paw-prints" && <PawPrintsPattern />}
      {pattern === "dots" && <DotsPattern />}
    </div>
  );
}
