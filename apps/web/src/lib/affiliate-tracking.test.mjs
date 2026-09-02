import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAffiliateClickEvent,
  getExternalLinkRel,
  isTrackableAffiliateLink,
  trackAffiliateClick,
} from "./affiliate-tracking.ts";

test("builds a complete affiliate click event", () => {
  assert.deepEqual(
    buildAffiliateClickEvent({
      affiliateProgram: "awin",
      affiliateMerchant: "PitPat",
      affiliatePlacementId: "gps-trackers-pitpat-primary",
      linkText: "Check PitPat prices",
      linkUrl:
        "https://www.awin1.com/cread.php?clickref=gps-trackers-pitpat-primary",
      pagePath: "/blog/best-dog-gps-trackers-uk",
    }),
    {
      eventName: "affiliate_click",
      payload: {
        affiliate_program: "awin",
        merchant: "PitPat",
        placement_id: "gps-trackers-pitpat-primary",
        link_text: "Check PitPat prices",
        link_url: "https://www.awin1.com/cread.php",
        link_domain: "www.awin1.com",
        page_path: "/blog/best-dog-gps-trackers-uk",
      },
    },
  );
});

test("marks affiliate links as sponsored", () => {
  assert.equal(
    getExternalLinkRel({ isAffiliate: true, openInNewTab: true }),
    "sponsored noopener noreferrer",
  );
});

test("sends the affiliate click event to gtag", () => {
  const calls = [];
  const sent = trackAffiliateClick((...args) => calls.push(args), {
    affiliateProgram: "awin",
    affiliateMerchant: "PitPat",
    affiliatePlacementId: "gps-trackers-pitpat-primary",
    linkText: "Check PitPat prices",
    linkUrl:
      "https://www.awin1.com/cread.php?clickref=gps-trackers-pitpat-primary",
    pagePath: "/blog/best-dog-gps-trackers-uk",
  });

  assert.equal(sent, true);
  assert.deepEqual(calls, [
    [
      "event",
      "affiliate_click",
      {
        affiliate_program: "awin",
        merchant: "PitPat",
        placement_id: "gps-trackers-pitpat-primary",
        link_text: "Check PitPat prices",
        link_url: "https://www.awin1.com/cread.php",
        link_domain: "www.awin1.com",
        page_path: "/blog/best-dog-gps-trackers-uk",
      },
    ],
  ]);
});

test("does not track stale affiliate metadata on internal links", () => {
  assert.equal(
    isTrackableAffiliateLink({
      href: "/blog/best-dog-gps-trackers-uk",
      isAffiliate: true,
      affiliateProgram: "awin",
      affiliateMerchant: "PitPat",
      affiliatePlacementId: "gps-trackers-pitpat-primary",
    }),
    false,
  );
});

test("does not send malformed affiliate URLs", () => {
  const calls = [];
  const sent = trackAffiliateClick((...args) => calls.push(args), {
    affiliateProgram: "awin",
    affiliateMerchant: "PitPat",
    affiliatePlacementId: "gps-trackers-pitpat-primary",
    linkText: "Check PitPat prices",
    linkUrl: "not-a-url",
    pagePath: "/blog/best-dog-gps-trackers-uk",
  });

  assert.equal(sent, false);
  assert.deepEqual(calls, []);
});
