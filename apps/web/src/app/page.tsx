import Link from "next/link";

import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchHomePageData(stega = true) {
  return await sanityFetch({
    query: queryHomePageData,
    stega,
  });
}

export const revalidate = 300; // Revalidate homepage every 5 minutes

export async function generateMetadata() {
  const { data: homePageData } = await fetchHomePageData(false);
  return getSEOMetadata(
    homePageData
      ? {
          title: homePageData?.title ?? homePageData?.seoTitle ?? "",
          description:
            homePageData?.description ?? homePageData?.seoDescription ?? "",
          slug: homePageData?.slug,
          contentId: homePageData?._id,
          contentType: homePageData?._type,
          ogImageUrl: homePageData?.seoImageUrl ?? undefined,
        }
      : {},
  );
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  const blocks = pageBuilder ?? [];
  const productBlock = blocks.find((block) => block._type === "appPromo");
  const pricingLink = (
    <section
      className="container mx-auto px-4 pb-8 md:px-6"
      aria-label="App pricing"
    >
      <div className="rounded-2xl border bg-muted/30 p-6 text-center">
        <h2 className="text-xl font-semibold">
          Find the right plan for your team
        </h2>
        <p className="mt-2 text-muted-foreground">
          Compare free and Premium app features.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-block rounded-md font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Compare plans and pricing
        </Link>
      </div>
    </section>
  );

  return blocks.length ? (
    <PageBuilder
      pageBuilder={blocks}
      id={_id}
      type={_type}
      afterBlock={{
        key: (productBlock ?? blocks[blocks.length - 1])!._key,
        content: pricingLink,
      }}
    />
  ) : (
    <main id="main-content">{pricingLink}</main>
  );
}
