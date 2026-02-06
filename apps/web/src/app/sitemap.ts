import type { MetadataRoute } from "next";

import { client } from "@/lib/sanity/client";

export const revalidate = 3600; // 1 hour
import { querySitemapData } from "@/lib/sanity/query";
import { getBaseUrl } from "@/utils";

interface SitemapPage {
  slug: string;
  lastModified: string | null;
}

const baseUrl = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { slugPages, blogPages, breedPages } = await client.fetch(querySitemapData);
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sitemap-index`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/breeds`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...(slugPages as SitemapPage[]).map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...(blogPages as SitemapPage[]).map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...(breedPages as SitemapPage[]).map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
