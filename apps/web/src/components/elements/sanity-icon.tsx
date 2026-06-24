import { cn } from "@workspace/ui/lib/utils";
import {
  BarChart3,
  Calendar,
  LayoutGrid,
  Megaphone,
  Palette,
  Settings,
  TrendingUp,
  Trophy,
  Users,
  WifiOff,
  Zap,
} from "lucide-react";
import { type HTMLAttributes, memo } from "react";

const FALLBACK_ICONS = {
  users: Users,
  calendar: Calendar,
  trophy: Trophy,
  zap: Zap,
  megaphone: Megaphone,
  palette: Palette,
  "trending-up": TrendingUp,
  settings: Settings,
  "wifi-off": WifiOff,
  "layout-grid": LayoutGrid,
  "bar-chart": BarChart3,
} as const;

interface IconProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "dangerouslySetInnerHTML"
> {
  icon?:
    | {
        svg?: string | null;
        name?: string | null;
      }
    | string
    | null;
  alt?: string; // Add alt text prop for accessibility
}

export const SanityIcon = memo(function SanityIconUnmemorized({
  icon,
  className,
  alt: altText = "sanity-icon",
  ...props
}: IconProps) {
  const alt = typeof icon === "object" && icon?.name ? icon?.name : altText;
  const svg = typeof icon === "object" ? icon?.svg : icon;
  const iconName = typeof icon === "object" ? icon?.name : null;
  const FallbackIcon = iconName
    ? FALLBACK_ICONS[iconName as keyof typeof FALLBACK_ICONS]
    : null;

  if (!svg && FallbackIcon) {
    return (
      <span
        {...props}
        className={cn(
          "flex size-12 items-center justify-center sanity-icon text-primary",
          className,
        )}
        aria-label={alt}
        title={alt}
      >
        <FallbackIcon className="size-6" aria-hidden="true" />
      </span>
    );
  }

  if (!svg) {
    return (
      <span
        {...props}
        className={cn(
          "flex size-12 items-center justify-center sanity-icon text-primary",
          className,
        )}
        aria-hidden="true"
      >
        <LayoutGrid className="size-6" />
      </span>
    );
  }

  return (
    <span
      {...props}
      className={cn(
        "flex size-12 items-center justify-center sanity-icon",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label={alt}
      title={alt}
    />
  );
});
