// Correct the known legacy Features copy without replacing future CMS SEO overrides.
const legacyFeaturesTitle =
  "Flyball Hub Features | Team management, public events and video timing";

export function getMarketingPageTitle(
  slug: string,
  seoTitle: string | null | undefined,
  title: string | null | undefined,
): string {
  const selectedTitle = seoTitle ?? title ?? "";
  if (slug === "features" && selectedTitle === legacyFeaturesTitle) {
    return "Features: teams, events and video timing";
  }
  return selectedTitle;
}
