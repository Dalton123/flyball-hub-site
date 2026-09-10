import assert from "node:assert/strict";
import test from "node:test";

import { getMarketingPageTitle } from "./marketing-page-title.ts";

const legacy =
  "Flyball Hub Features | Team management, public events and video timing";
test("corrects the legacy Features SEO title", () => {
  assert.equal(
    getMarketingPageTitle("features", legacy, "Features"),
    "Features: teams, events and video timing",
  );
});
test("corrects legacy fallback copy when no SEO override exists", () => {
  assert.equal(
    getMarketingPageTitle("features", null, legacy),
    "Features: teams, events and video timing",
  );
});
test("preserves newer CMS overrides and nullish precedence", () => {
  for (const override of [
    "Custom features title",
    "",
    "Features | Flyball Hub",
  ]) {
    assert.equal(getMarketingPageTitle("features", override, legacy), override);
  }
});
test("does not rewrite any other route, including pilot slugs", () => {
  for (const slug of [
    "pricing",
    "blog/best-dog-gps-trackers-uk",
    "blog/best-dog-paw-balm",
    "blog/best-snuffle-mats-uk",
    "blog/best-joint-supplements-active-dogs-uk",
  ]) {
    assert.equal(getMarketingPageTitle(slug, legacy, "Fallback"), legacy);
  }
});
test("preserves title fallback and empty values", () => {
  assert.equal(
    getMarketingPageTitle("features", undefined, "Features"),
    "Features",
  );
  assert.equal(getMarketingPageTitle("features", null, null), "");
});
