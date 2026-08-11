import type { SanityImageProps } from "@/types";

export interface SponsorCampaign {
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
}

export interface SponsorPlacementValue {
  placementId?: string | null;
  sponsor?: SponsorCampaign | null;
}

export type SponsorPlacementType =
  | "blog_card"
  | "homepage_card"
  | "sitewide_supporter";

export type SponsorContentCategory = "blog" | "homepage" | "sitewide";

type SponsorEventName = "sponsor_impression" | "sponsor_click";

type GtagWindow = Window & {
  gtag?: (command: "event", eventName: string, payload: object) => void;
};

export function buildSponsorUrl(
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

export function trackSponsorEvent(
  eventName: SponsorEventName,
  value: SponsorPlacementValue,
  placementType: SponsorPlacementType,
  contentCategory: SponsorContentCategory,
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
