import type { Metadata } from "next";

import { BreedCard } from "@/components/breed-card";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { PageBuilder } from "@/components/pagebuilder";
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
    <main>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold md:text-5xl mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </header>

        {/* Breed Grid */}
        <section>
          <h2 className="sr-only">All Breeds</h2>
          {breeds.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {breeds.map((breed) => (
                <BreedCard key={breed._id} breed={breed} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No breed guides available yet. Check back soon!
              </p>
            </div>
          )}
        </section>
      </div>

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
