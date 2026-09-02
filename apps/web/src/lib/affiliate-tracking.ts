export interface AffiliateClickInput {
  affiliateProgram: string;
  affiliateMerchant: string;
  affiliatePlacementId: string;
  linkText: string;
  linkUrl: string;
  pagePath: string;
}

export interface AffiliateClickEvent {
  eventName: "affiliate_click";
  payload: {
    affiliate_program: string;
    merchant: string;
    placement_id: string;
    link_text: string;
    link_url: string;
    link_domain: string;
    page_path: string;
  };
}

export interface AffiliateLinkCandidate {
  href?: string;
  isAffiliate?: boolean;
  affiliateProgram?: string;
  affiliateMerchant?: string;
  affiliatePlacementId?: string;
}

export function isTrackableAffiliateLink(
  candidate: AffiliateLinkCandidate,
): candidate is Required<AffiliateLinkCandidate> {
  if (
    candidate.isAffiliate !== true ||
    !candidate.href ||
    !candidate.affiliateProgram ||
    !candidate.affiliateMerchant ||
    !candidate.affiliatePlacementId
  ) {
    return false;
  }

  try {
    const url = new URL(candidate.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export interface ExternalLinkRelInput {
  isAffiliate: boolean;
  openInNewTab: boolean;
}

export function getExternalLinkRel({
  isAffiliate,
  openInNewTab,
}: ExternalLinkRelInput): string | undefined {
  const values = [
    isAffiliate ? "sponsored" : null,
    openInNewTab ? "noopener" : null,
    openInNewTab ? "noreferrer" : null,
  ].filter(Boolean);

  return values.length > 0 ? values.join(" ") : undefined;
}

export type GtagEventSender = (
  command: "event",
  eventName: string,
  payload: AffiliateClickEvent["payload"],
) => void;

export function trackAffiliateClick(
  gtag: GtagEventSender | undefined,
  input: AffiliateClickInput,
): boolean {
  if (!gtag) return false;

  try {
    const event = buildAffiliateClickEvent(input);
    gtag("event", event.eventName, event.payload);
    return true;
  } catch {
    return false;
  }
}

export function buildAffiliateClickEvent(
  input: AffiliateClickInput,
): AffiliateClickEvent {
  const url = new URL(input.linkUrl);

  return {
    eventName: "affiliate_click",
    payload: {
      affiliate_program: input.affiliateProgram,
      merchant: input.affiliateMerchant,
      placement_id: input.affiliatePlacementId,
      link_text: input.linkText,
      link_url: `${url.origin}${url.pathname}`,
      link_domain: url.hostname,
      page_path: input.pagePath,
    },
  };
}
