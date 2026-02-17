import type { Metadata } from "next";

import { Badge } from "@workspace/ui/components/badge";

import { BreedGrid } from "@/components/breed-grid";
import { BreedTraits } from "@/components/breed-traits";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageBuilder } from "@/components/pagebuilder";
import { BackgroundPattern } from "@/components/elements/background-pattern";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBreedIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { BreedCardData } from "@/types";

interface BreedIndexData {
  _id: string;
  _type: string;
  title: string | null;
  description: string | null;
  slug: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageBuilder: any[] | null;
  breeds: BreedCardData[] | null;
}

async function fetchBreedIndexData(stega = true) {
  const { data } = await sanityFetch({
    query: queryBreedIndexPageData,
    stega,
  });
  return data as BreedIndexData | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchBreedIndexData(false);

  return getSEOMetadata({
    title: data?.title ?? "Dog Breeds for Flyball",
    description:
      data?.description ??
      "Discover which dog breeds excel at flyball. Our comprehensive breed guides cover suitability, training tips, and what makes each breed unique for this fast-paced sport.",
    slug: data?.slug ?? "/breeds",
    contentId: data?._id,
    contentType: data?._type,
    pageType: "website",
    keywords: [
      "flyball breeds",
      "best dogs for flyball",
      "flyball dog breeds",
      "height dogs",
      "flyball suitability",
    ],
  });
}

export default async function BreedsIndexPage() {
  const data = await fetchBreedIndexData();

  const title = data?.title ?? "Dog Breeds for Flyball";
  const description =
    data?.description ??
    "Find the perfect flyball companion. Our breed guides cover everything from speed and trainability to height dog potential.";
  const breeds = data?.breeds ?? [];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Breeds", url: "/breeds" },
  ];

  return (
    <main className="bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <BackgroundPattern pattern="tennis-balls" opacity={0.03} />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="relative mb-6 overflow-hidden px-4 py-1.5 text-sm font-medium"
            >
              <span className="relative z-10">Breed Guides</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
            </Badge>
            <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl text-balance leading-tight mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* All Breeds Grid with Filters */}
      {breeds.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Browse Breed Guides
            </h2>
            <Badge variant="secondary" className="text-xs">
              {breeds.length} breeds
            </Badge>
          </div>
          <BreedGrid breeds={breeds} />
        </section>
      )}

      {/* What Makes a Good Flyball Dog */}
      <BreedTraits />

      {/* Page Builder Blocks */}
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
