import type { MetadataRoute } from "next";

import { client } from "@/lib/sanity/client";
import { querySitemapData } from "@/lib/sanity/query";
import { getBaseUrl } from "@/utils";

import {
  buildDynamicSitemapEntries,
  type SitemapData,
} from "./sitemap-entries";

export const revalidate = 86400; // 24 hours

const baseUrl = getBaseUrl();
const supplementalIndexableSlugs = ["/blog/best-flirt-poles"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapData = (await client.fetch(querySitemapData)) as SitemapData;
  const entries: MetadataRoute.Sitemap = [
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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/breeds`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...buildDynamicSitemapEntries(sitemapData, baseUrl),
    ...supplementalIndexableSlugs.map((slug) => ({
      url: `${baseUrl}${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return entries.filter(
    (entry, index, allEntries) =>
      allEntries.findIndex((candidate) => candidate.url === entry.url) ===
      index,
  );
}
