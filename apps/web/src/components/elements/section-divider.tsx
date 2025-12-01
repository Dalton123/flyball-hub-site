import { cn } from "@workspace/ui/lib/utils";
import { PawPrint } from "@/components/icons";

type DividerVariant = "wave" | "diagonal" | "paw-trail";
type DividerColor = "primary" | "secondary" | "accent" | "muted" | "background";

interface SectionDividerProps {
  variant?: DividerVariant;
  flip?: boolean;
  color?: DividerColor;
  className?: string;
}

const colorMap: Record<DividerColor, string> = {
  primary: "fill-primary",
  secondary: "fill-secondary",
  accent: "fill-accent",
  muted: "fill-muted",
  background: "fill-background",
};

const textColorMap: Record<DividerColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  muted: "text-muted",
  background: "text-background",
};

function WaveDivider({ flip, color }: { flip?: boolean; color: DividerColor }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "w-full h-auto block",
        colorMap[color],
        flip && "rotate-180"
      )}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" />
    </svg>
  );
}

function DiagonalDivider({
  flip,
  color,
}: {
  flip?: boolean;
  color: DividerColor;
}) {
  return (
    <svg
      viewBox="0 0 1440 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "w-full h-auto block",
        colorMap[color],
        flip && "rotate-180"
      )}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points="0,80 1440,0 1440,80" />
    </svg>
  );
}

function PawTrailDivider({ color }: { color: DividerColor }) {
  // Create a trail of paw prints across the page
  const pawCount = 8;

  return (
    <div
      className={cn(
        "w-full flex items-center justify-between px-8 py-4",
        textColorMap[color]
      )}
      aria-hidden="true"
    >
      {Array.from({ length: pawCount }).map((_, i) => (
        <PawPrint
          key={`paw-${i}`}
          size={24}
          className={cn(
            "opacity-30",
            // Alternate rotation for natural walking pattern
            i % 2 === 0 ? "rotate-[-15deg]" : "rotate-[15deg]"
          )}
        />
      ))}
    </div>
  );
}

export function SectionDivider({
  variant = "wave",
  flip = false,
  color = "muted",
  className,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-none",
        flip ? "-mt-px" : "-mb-px",
        className
      )}
    >
      {variant === "wave" && <WaveDivider flip={flip} color={color} />}
      {variant === "diagonal" && <DiagonalDivider flip={flip} color={color} />}
      {variant === "paw-trail" && <PawTrailDivider color={color} />}
    </div>
  );
}
