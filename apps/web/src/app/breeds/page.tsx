import type { Metadata } from "next";

import { BreedCard } from "@/components/breed-card";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { sanityFetch } from "@/lib/sanity/live";
import { queryAllBreeds } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { BreedCardData } from "@/types";

export const metadata: Metadata = getSEOMetadata({
  title: "Dog Breeds for Flyball",
  description:
    "Discover which dog breeds excel at flyball. Our comprehensive breed guides cover suitability, training tips, and what makes each breed unique for this fast-paced sport.",
  slug: "/breeds",
  pageType: "website",
  keywords: [
    "flyball breeds",
    "best dogs for flyball",
    "flyball dog breeds",
    "height dogs",
    "flyball suitability",
  ],
});

export default async function BreedsIndexPage() {
  const { data } = await sanityFetch({
    query: queryAllBreeds,
  });
  // Cast to our temporary type until schema is deployed
  const breeds = data as BreedCardData[] | null;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Breeds", url: "/breeds" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold md:text-5xl mb-4">
            Dog Breeds for Flyball
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect flyball companion. Our breed guides cover
            everything from speed and trainability to height dog potential.
          </p>
        </header>

        {/* Breed Grid */}
        {breeds && breeds.length > 0 ? (
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
      </div>
    </>
  );
}
