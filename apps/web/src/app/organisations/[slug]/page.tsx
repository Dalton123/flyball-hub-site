import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { OrganisationPage } from "@/components/organisation-page";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryOrganisationBySlug,
  queryOrganisationPaths,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { OrganisationPageData } from "@/types";

async function fetchOrganisationBySlug(slug: string, stega = true) {
  const result = await sanityFetch({
    query: queryOrganisationBySlug,
    params: { slug: `/organisations/${slug}` },
    stega,
  });
  return { ...result, data: result.data as OrganisationPageData | null };
}

async function fetchOrganisationPaths() {
  const slugs = (await client.fetch(queryOrganisationPaths, undefined, {
    perspective: "published",
  })) as string[];

  return slugs.flatMap((slug) => {
    const organisationSlug = slug?.split("/").filter(Boolean).at(-1);
    return organisationSlug ? [{ slug: organisationSlug }] : [];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchOrganisationBySlug(slug, false);
  if (!data) return {};

  return getSEOMetadata({
    title:
      data.seoTitle ??
      (data.name ? `${data.name} - Flyball Organisation Guide` : undefined),
    description: data.seoDescription ?? data.summary ?? undefined,
    slug: data.slug ?? undefined,
    contentId: data._id,
    contentType: data._type,
    seoNoIndex: data.seoNoIndex ?? false,
    pageType: "website",
  });
}

export async function generateStaticParams() {
  return await fetchOrganisationPaths();
}

export const revalidate = 300;

export default async function OrganisationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchOrganisationBySlug(slug);
  if (!data) return notFound();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Organisations", url: "/organisations" },
    {
      name: data.name ?? "Organisation",
      url: data.slug ?? `/organisations/${slug}`,
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs
        items={breadcrumbs}
        className="container mx-auto px-4 pt-8 pb-2 md:px-6"
      />
      <OrganisationPage organisation={data} />
    </>
  );
}
