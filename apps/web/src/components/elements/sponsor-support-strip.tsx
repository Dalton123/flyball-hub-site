"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildSponsorUrl,
  type SponsorCampaign,
  trackSponsorEvent,
} from "@/lib/sponsor";

const PLACEMENT_ID = "sitewide-footer-supporter";
const MAX_TIMEOUT_MS = 2_147_000_000;

interface SponsorSupportStripProps {
  sponsor: SponsorCampaign;
}

export function SponsorSupportStrip({ sponsor }: SponsorSupportStripProps) {
  const stripRef = useRef<HTMLElement>(null);
  const impressionSent = useRef(false);
  const [campaignTime, setCampaignTime] = useState(() => Date.now());
  const value = useMemo(
    () => ({ placementId: PLACEMENT_ID, sponsor }),
    [sponsor],
  );

  const isLive = useMemo(() => {
    if (sponsor.status !== "live" || !sponsor.startsAt || !sponsor.endsAt) {
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
  }, [campaignTime, sponsor.endsAt, sponsor.startsAt, sponsor.status]);

  useEffect(() => {
    if (!isLive || !sponsor.endsAt) return;

    const remainingMs = Date.parse(sponsor.endsAt) - Date.now() + 1_000;
    const timeoutId = window.setTimeout(
      () => setCampaignTime(Date.now()),
      Math.min(Math.max(remainingMs, 0), MAX_TIMEOUT_MS),
    );

    return () => window.clearTimeout(timeoutId);
  }, [campaignTime, isLive, sponsor.endsAt]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!isLive || !strip || impressionSent.current) return;

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
            "sitewide_supporter",
            "sitewide",
          );
          impressionSent.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(strip);
    return () => observer.disconnect();
  }, [isLive, value]);

  if (
    !isLive ||
    !sponsor._id ||
    !sponsor.name ||
    !sponsor.campaignId ||
    !sponsor.destinationUrl
  ) {
    return null;
  }

  let href: string;

  try {
    href = buildSponsorUrl(
      sponsor.destinationUrl,
      sponsor.campaignId,
      PLACEMENT_ID,
    );
  } catch {
    return null;
  }

  const ctaLabel = sponsor.ctaLabel || `Visit ${sponsor.name}`;

  return (
    <aside
      ref={stripRef}
      aria-label={`Sponsored support from ${sponsor.name}`}
      className="border-y border-primary/15 bg-[var(--field-warm)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          <span className="w-fit rounded-full border border-primary/25 bg-background px-2.5 py-1 text-[0.6875rem] font-black uppercase tracking-[0.14em] text-primary">
            Sponsored
          </span>
          <p className="text-sm font-semibold text-foreground sm:text-base">
            Supported by {sponsor.name}
          </p>
          {sponsor.discountCode && (
            <p className="text-sm text-foreground">
              Use code{" "}
              <span
                translate="no"
                className="break-all rounded border border-foreground/20 bg-background px-2 py-1 font-mono text-xs font-bold"
              >
                {sponsor.discountCode}
              </span>
            </p>
          )}
        </div>

        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() =>
            trackSponsorEvent(
              "sponsor_click",
              value,
              "sitewide_supporter",
              "sitewide",
            )
          }
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--field-warm)]"
        >
          {ctaLabel}
          <ExternalLinkIcon className="size-4" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
