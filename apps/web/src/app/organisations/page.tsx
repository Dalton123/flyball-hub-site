import { Badge } from "@workspace/ui/components/badge";
import type { Metadata } from "next";

import { BackgroundPattern } from "@/components/elements/background-pattern";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { OrganisationGrid } from "@/components/organisation-grid";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryOrganisationIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { OrganisationCardData } from "@/types";

interface OrganisationIndexData {
  _id: string;
  _type: string;
  title: string | null;
  description: string | null;
  slug: string | null;
  seoNoIndex?: boolean | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageBuilder: any[] | null;
  organisations: OrganisationCardData[] | null;
}

async function fetchOrganisationIndexData(stega = true) {
  const { data } = await sanityFetch({
    query: queryOrganisationIndexPageData,
    stega,
  });
  return data as OrganisationIndexData | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchOrganisationIndexData(false);

  return getSEOMetadata({
    title: data?.title ?? "Flyball Organisations and Leagues",
    description:
      data?.description ??
      "Independent guides to flyball governing bodies, leagues, rules, events and official resources around the world.",
    slug: data?.slug ?? "/organisations",
    contentId: data?._id,
    contentType: data?._type,
    seoNoIndex: data?.seoNoIndex ?? false,
    pageType: "website",
    keywords: [
      "flyball organisations",
      "flyball leagues",
      "flyball governing bodies",
      "flyball rules",
    ],
  });
}

export const revalidate = 300;

export default async function OrganisationsIndexPage() {
  const data = await fetchOrganisationIndexData();
  const title = data?.title ?? "Flyball Organisations and Leagues";
  const description =
    data?.description ??
    "Explore independent guides to the organisations behind flyball competition around the world.";
  const organisations = data?.organisations ?? [];
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Organisations", url: "/organisations" },
  ];

  return (
    <main className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <section className="relative overflow-hidden py-12 md:py-20">
        <BackgroundPattern pattern="tennis-balls" opacity={0.025} />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium"
            >
              Verified organisation guides
            </Badge>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-balance md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-balance text-muted-foreground md:text-xl">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section
        className="container mx-auto px-4 py-10 md:px-6 md:py-16"
        aria-labelledby="organisation-guides-heading"
      >
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <h2
            id="organisation-guides-heading"
            className="text-2xl font-semibold md:text-3xl"
          >
            Browse organisation guides
          </h2>
          <Badge variant="secondary" className="text-xs">
            {organisations.length}{" "}
            {organisations.length === 1 ? "guide" : "guides"}
          </Badge>
        </div>
        {organisations.length > 0 ? (
          <OrganisationGrid organisations={organisations} />
        ) : (
          <p className="rounded-2xl bg-muted/55 p-6 text-muted-foreground">
            The first verified organisation guides are being prepared.
          </p>
        )}
      </section>

      {data?.pageBuilder && data.pageBuilder.length > 0 && (
        <PageBuilder
          pageBuilder={data.pageBuilder}
          id={data._id}
          type={data._type}
        />
      )}
    </main>
  );
}
