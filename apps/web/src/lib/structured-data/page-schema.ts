import type {
  BreadcrumbList,
  ListItem,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

export interface PageSchemaInput {
  title?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  slug?: string | null;
  _updatedAt?: string | null;
}

interface PageSchemaOptions {
  baseUrl: string;
  siteTitle?: string | null;
}

export interface PageBreadcrumbItem {
  name: string;
  url: string;
}

function normaliseBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, "");
}

function normaliseSlug(slug?: string | null) {
  if (!slug || slug === "/") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function absoluteUrl(baseUrl: string, slug?: string | null) {
  const cleanBaseUrl = normaliseBaseUrl(baseUrl);
  const cleanSlug = normaliseSlug(slug);
  return cleanSlug === "/" ? cleanBaseUrl : `${cleanBaseUrl}${cleanSlug}`;
}

function pageName(page: PageSchemaInput) {
  return page.seoTitle || page.title || "Flyball Hub";
}

function pageDescription(page: PageSchemaInput) {
  return page.seoDescription || page.description || undefined;
}

export function buildPageBreadcrumbItems(
  page: PageSchemaInput,
): PageBreadcrumbItem[] {
  const slug = normaliseSlug(page.slug);
  const items: PageBreadcrumbItem[] = [{ name: "Home", url: "/" }];

  if (slug !== "/") {
    items.push({
      name: pageName(page),
      url: slug,
    });
  }

  return items;
}

export function buildPageJsonLd(
  page: PageSchemaInput,
  { baseUrl, siteTitle = "Flyball Hub" }: PageSchemaOptions,
): WithContext<WebPage> {
  const cleanBaseUrl = normaliseBaseUrl(baseUrl);
  const pageUrl = absoluteUrl(cleanBaseUrl, page.slug);
  const breadcrumbs = buildPageBreadcrumbItems(page);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName(page),
    description: pageDescription(page),
    url: pageUrl,
    dateModified: page._updatedAt
      ? new Date(page._updatedAt).toISOString()
      : undefined,
    isPartOf: {
      "@type": "WebSite",
      name: siteTitle || "Flyball Hub",
      url: cleanBaseUrl,
    } as WebSite,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map(
        (item, index): ListItem => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(cleanBaseUrl, item.url),
        }),
      ),
    } as BreadcrumbList,
  };
}
