"use client";

import { ExternalLink, Facebook, Globe, MapPin } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";

import { formatDistance, getCountryFlag } from "@/lib/geo";

export interface SocialLinks {
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
}

export interface TeamCardProps {
  name: string;
  slug: string;
  logoUrl: string | null;
  locationName: string | null;
  country: string | null;
  leagues: string[];
  socialLinks: SocialLinks | null;
  primaryColor: string | null;
  distance?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TeamLogo({
  logoUrl,
  name,
  primaryColor,
}: {
  logoUrl: string | null;
  name: string;
  primaryColor: string | null;
}) {
  // Consistent container for both logo and initials
  const containerClasses =
    "relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30 overflow-hidden";

  if (logoUrl) {
    return (
      <div className={containerClasses}>
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="size-10 object-contain"
        />
      </div>
    );
  }

  // Fallback: initials with subtle accent
  const accentColor = primaryColor || "#6366f1";

  return (
    <div
      className={containerClasses}
      style={{
        borderColor: `${accentColor}40`,
        background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}15 100%)`,
      }}
    >
      <span
        className="text-sm font-semibold tracking-tight"
        style={{ color: accentColor }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}

function SocialLinkIcon({
  type,
  url,
}: {
  type: "website" | "facebook" | "instagram";
  url: string;
}) {
  const icons = {
    website: Globe,
    facebook: Facebook,
    instagram: ExternalLink, // Could use Instagram icon if available
  };

  const labels = {
    website: "Website",
    facebook: "Facebook",
    instagram: "Instagram",
  };

  const Icon = icons[type];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={labels[type]}
    >
      <Icon className="size-3.5" />
    </a>
  );
}

export function TeamCard({
  name,
  logoUrl,
  locationName,
  country,
  leagues,
  socialLinks,
  primaryColor,
  distance,
}: TeamCardProps) {
  const flag = getCountryFlag(country);

  const hasSocialLinks =
    socialLinks?.website || socialLinks?.facebook || socialLinks?.instagram;

  return (
    <article className="group relative flex gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-md hover:shadow-black/5">
      {/* Logo */}
      <TeamLogo logoUrl={logoUrl} name={name} primaryColor={primaryColor} />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {/* Header row: Name + Distance */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold leading-snug tracking-tight">
            {name}
          </h3>
          {distance !== undefined && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
            >
              {formatDistance(distance)}
            </Badge>
          )}
        </div>

        {/* Location */}
        {(locationName || country) && (
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <MapPin className="size-3 shrink-0 opacity-60" />
            <span className="truncate">
              {locationName}
              {locationName && flag && " "}
              {flag}
            </span>
          </div>
        )}

        {/* Footer: Leagues + Social Links */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1">
          {leagues.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {leagues.map((league) => (
                <Badge
                  key={league}
                  variant="outline"
                  className="rounded-md border-border/80 px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                >
                  {league}
                </Badge>
              ))}
            </div>
          )}

          {hasSocialLinks && (
            <div className="ml-auto flex items-center gap-0.5">
              {socialLinks?.website && (
                <SocialLinkIcon type="website" url={socialLinks.website} />
              )}
              {socialLinks?.facebook && (
                <SocialLinkIcon type="facebook" url={socialLinks.facebook} />
              )}
              {socialLinks?.instagram && (
                <SocialLinkIcon type="instagram" url={socialLinks.instagram} />
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border/60 bg-card p-4">
      <div className="size-12 shrink-0 rounded-xl bg-muted animate-pulse" />
      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="h-[18px] w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-[18px] w-10 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="h-[16px] w-1/2 rounded bg-muted animate-pulse" />
        <div className="mt-auto flex gap-1 pt-1">
          <div className="h-[16px] w-10 rounded-md bg-muted animate-pulse" />
          <div className="h-[16px] w-12 rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
