import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { BreedPage } from "@/components/breed-page";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBreedBySlug, queryBreedPaths } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { BreedPageData } from "@/types";

async function fetchBreedBySlug(slug: string, stega = true) {
  const result = await sanityFetch({
    query: queryBreedBySlug,
    params: { slug: `/breeds/${slug}` },
    stega,
  });
  // Cast to our temporary type until schema is deployed
  return { ...result, data: result.data as BreedPageData | null };
}

async function fetchBreedPaths() {
  const slugs = (await client.fetch(queryBreedPaths, undefined, {
    perspective: "published",
  })) as string[];
  const paths: { slug: string }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    // Extract the breed slug from full path: /breeds/border-collie -> border-collie
    const parts = slug.split("/");
    const breedSlug = parts[parts.length - 1];
    if (breedSlug) paths.push({ slug: breedSlug });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchBreedBySlug(slug, false);

  if (!data) return {};

  return getSEOMetadata({
    title: data.name ? `${data.name} - Flyball Breed Guide` : undefined,
    description: data.verdict ?? undefined,
    slug: data.slug ?? undefined,
    contentId: data._id,
    contentType: data._type ?? undefined,
    pageType: "article",
  });
}

export async function generateStaticParams() {
  return await fetchBreedPaths();
}

export default async function BreedSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchBreedBySlug(slug);

  if (!data) return notFound();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Breeds", url: "/breeds" },
    { name: data.name ?? "Breed", url: data.slug ?? `/breeds/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} className="container mx-auto px-4 pt-8 pb-4" />
      <BreedPage breed={data} />
    </>
  );
}
