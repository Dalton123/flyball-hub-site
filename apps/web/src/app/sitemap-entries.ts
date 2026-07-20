import type { MetadataRoute } from "next";

export interface SitemapPage {
  slug: string;
  lastModified: string | null;
}

export interface SitemapData {
  slugPages: SitemapPage[];
  blogPages: SitemapPage[];
  breedPages: SitemapPage[];
}

function buildEntries(
  pages: SitemapPage[],
  baseUrl: string,
  changeFrequency: "weekly" | "monthly",
  priority: number,
): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${baseUrl}${page.slug}`,
    lastModified: page.lastModified ? new Date(page.lastModified) : undefined,
    changeFrequency,
    priority,
  }));
}

export function buildDynamicSitemapEntries(
  { slugPages, blogPages, breedPages }: SitemapData,
  baseUrl: string,
): MetadataRoute.Sitemap {
  return [
    ...buildEntries(slugPages, baseUrl, "weekly", 0.8),
    ...buildEntries(blogPages, baseUrl, "weekly", 0.8),
    ...buildEntries(breedPages, baseUrl, "monthly", 0.7),
  ];
}
