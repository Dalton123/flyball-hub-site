"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { SanityImageProps } from "@/types";

import { SanityImage } from "./sanity-image";

export interface SponsorPlacementValue {
  placementId?: string | null;
  sponsor?: {
    _id?: string | null;
    name?: string | null;
    campaignId?: string | null;
    status?: string | null;
    startsAt?: string | null;
    endsAt?: string | null;
    destinationUrl?: string | null;
    supportingCopy?: string | null;
    ctaLabel?: string | null;
    discountCode?: string | null;
    desktopImage?: SanityImageProps | null;
    mobileImage?: SanityImageProps | null;
  } | null;
}

type SponsorEventName = "sponsor_impression" | "sponsor_click";

type GtagWindow = Window & {
  gtag?: (command: "event", eventName: string, payload: object) => void;
};

const MAX_TIMEOUT_MS = 2_147_000_000;

interface SponsorPlacementProps {
  value: SponsorPlacementValue;
  placementType?: "blog_card" | "homepage_card";
  contentCategory?: "blog" | "homepage";
}

export function SponsorPlacement({
  value,
  placementType = "blog_card",
  contentCategory = "blog",
}: SponsorPlacementProps) {
  const placementRef = useRef<HTMLElement>(null);
  const impressionSent = useRef(false);
  const [campaignTime, setCampaignTime] = useState(() => Date.now());
  const sponsor = value.sponsor;

  const isLive = useMemo(() => {
    if (sponsor?.status !== "live" || !sponsor.startsAt || !sponsor.endsAt) {
      return false;
    }

    const startsAt = Date.parse(sponsor.startsAt);
    const endsAt = Date.parse(sponsor.endsAt);
    return (
      Number.isFinite(startsAt) &&
      Number.isFinite(endsAt) &&
      campaignTime >= startsAt &&
      campaignTime <= endsAt
    );
  }, [campaignTime, sponsor?.endsAt, sponsor?.startsAt, sponsor?.status]);

  useEffect(() => {
    if (!isLive || !sponsor?.endsAt) return;

    const remainingMs = Date.parse(sponsor.endsAt) - Date.now() + 1_000;
    const timeoutId = window.setTimeout(
      () => setCampaignTime(Date.now()),
      Math.min(Math.max(remainingMs, 0), MAX_TIMEOUT_MS),
    );

    return () => window.clearTimeout(timeoutId);
  }, [isLive, sponsor?.endsAt]);

  useEffect(() => {
    const placement = placementRef.current;
    if (!isLive || !placement || impressionSent.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          entry.intersectionRatio >= 0.5 &&
          !impressionSent.current
        ) {
          trackSponsorEvent(
            "sponsor_impression",
            value,
            placementType,
            contentCategory,
          );
          impressionSent.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(placement);
    return () => observer.disconnect();
  }, [contentCategory, isLive, placementType, value]);

  if (
    !isLive ||
    !sponsor?.name ||
    !sponsor.campaignId ||
    !sponsor.destinationUrl ||
    !sponsor.desktopImage?.id ||
    !sponsor.mobileImage?.id ||
    !value.placementId
  ) {
    return null;
  }

  const href = buildSponsorUrl(
    sponsor.destinationUrl,
    sponsor.campaignId,
    value.placementId,
  );
  const ctaLabel = sponsor.ctaLabel || `Visit ${sponsor.name}`;

  return (
    <aside
      ref={placementRef}
      aria-label={`Sponsored by ${sponsor.name}`}
      className="not-prose my-10 overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-4 py-2.5 sm:px-5">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-primary">
          Sponsored
        </span>
        <span className="text-xs text-muted-foreground">
          Paid placement supporting Flyball Hub
        </span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() =>
          trackSponsorEvent(
            "sponsor_click",
            value,
            placementType,
            contentCategory,
          )
        }
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="md:hidden">
          <SanityImage
            image={sponsor.mobileImage}
            alt={sponsor.mobileImage.alt || `${sponsor.name} sponsored offer`}
            width={600}
            height={500}
            sizes="calc(100vw - 48px)"
            className="h-auto w-full"
          />
        </div>
        <div className="hidden md:block">
          <SanityImage
            image={sponsor.desktopImage}
            alt={sponsor.desktopImage.alt || `${sponsor.name} sponsored offer`}
            width={1200}
            height={630}
            sizes="(max-width: 1024px) calc(100vw - 80px), 896px"
            className="h-auto w-full"
          />
        </div>

        <div className="grid gap-3 border-t border-border px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5">
          <div>
            {sponsor.supportingCopy && (
              <p className="text-sm leading-6 text-muted-foreground">
                {sponsor.supportingCopy}
              </p>
            )}
            {sponsor.discountCode && (
              <p className="mt-1 text-sm font-semibold text-foreground">
                Use code <span translate="no">{sponsor.discountCode}</span>
              </p>
            )}
          </div>
          <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">
            {ctaLabel}
            <ExternalLinkIcon className="size-4" aria-hidden="true" />
          </span>
        </div>
      </a>
    </aside>
  );
}

function buildSponsorUrl(
  destinationUrl: string,
  campaignId: string,
  placementId: string,
): string {
  const url = new URL(destinationUrl);
  url.searchParams.set("utm_source", "flyballhub");
  url.searchParams.set("utm_medium", "sponsor");
  url.searchParams.set("utm_campaign", campaignId);
  url.searchParams.set("utm_content", placementId);
  return url.toString();
}

function trackSponsorEvent(
  eventName: SponsorEventName,
  value: SponsorPlacementValue,
  placementType: "blog_card" | "homepage_card",
  contentCategory: "blog" | "homepage",
) {
  const sponsor = value.sponsor;
  if (
    typeof window === "undefined" ||
    !sponsor?._id ||
    !sponsor.name ||
    !sponsor.campaignId ||
    !sponsor.destinationUrl ||
    !value.placementId
  ) {
    return;
  }

  const destinationUrl = sponsor.destinationUrl;
  const payload = {
    sponsor_id: sponsor._id,
    sponsor_name: sponsor.name,
    placement_id: value.placementId,
    placement_type: placementType,
    campaign: sponsor.campaignId,
    page_path: window.location.pathname,
    link_url: destinationUrl,
    link_domain: new URL(destinationUrl).hostname,
    content_category: contentCategory,
  };
  const gtag = (window as GtagWindow).gtag;

  if (typeof gtag === "function") {
    gtag("event", eventName, payload);
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[SponsorPlacement]", eventName, payload);
  }
}
