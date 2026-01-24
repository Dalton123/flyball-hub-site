import { stegaClean } from "next-sanity";
import { notFound } from "next/navigation";

import { RichText } from "@/components/elements/rich-text";
import { cleanText } from "@/utils";
import { SanityImage } from "@/components/elements/sanity-image";
import { TableOfContent } from "@/components/elements/table-of-content";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  queryBlogPaths,
  queryBlogSlugPageData,
  querySettingsData,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchBlogSlugPageData(slug: string, stega = true) {
  return await sanityFetch({
    query: queryBlogSlugPageData,
    params: { slug: `/blog/${slug}` },
    stega,
  });
}

async function fetchBlogPaths() {
  const slugs = await client.fetch(queryBlogPaths);
  const paths: { slug: string }[] = [];
  for (const slug of slugs) {
    if (!slug) continue;
    const [, , path] = slug.split("/");
    if (path) paths.push({ slug: path });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await fetchBlogSlugPageData(slug, false);
  return getSEOMetadata(
    data
      ? {
          title: data?.title ?? data?.seoTitle ?? "",
          description: data?.description ?? data?.seoDescription ?? "",
          slug: data?.slug,
          contentId: data?._id,
          contentType: data?._type,
          pageType: "article",
          // Article-specific properties for Open Graph
          publishedTime: data?.publishedAt ?? data?._createdAt,
          modifiedTime: data?._updatedAt,
          author: data?.authors?.name,
        }
      : {},
  );
}

export async function generateStaticParams() {
  return await fetchBlogPaths();
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ data }, settings] = await Promise.all([
    fetchBlogSlugPageData(slug),
    client.fetch(querySettingsData),
  ]);
  if (!data) return notFound();
  const { title, description, image, richText, authors, publishedAt } =
    data ?? {};

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: title ?? "Article", url: data.slug ?? `/blog/${slug}` },
  ];

  return (
    <div className="container my-16 mx-auto px-4 md:px-6 ">
      <ArticleJsonLd
        article={stegaClean(data)}
        settings={stegaClean(settings)}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <header className="mb-8">
            <h1 className="mt-2 text-4xl font-bold">{cleanText(title)}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{cleanText(description)}</p>
            {authors && (
              <div className="mt-6 flex items-center gap-x-4">
                <div className="text-sm">
                  <p className="font-semibold">{stegaClean(authors.name)}</p>
                  <div className="flex items-center gap-x-2 text-muted-foreground">
                    {authors.position && (
                      <>
                        <span>{stegaClean(authors.position)}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    {publishedAt && (
                      <time dateTime={publishedAt}>
                        {new Date(publishedAt).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                </div>
              </div>
            )}
          </header>
          {image && (
            <div className="mb-12">
              <SanityImage
                image={image}
                alt={title}
                width={1600}
                loading="eager"
                height={900}
                className="rounded-lg h-auto w-full"
              />
            </div>
          )}
          <RichText richText={richText ?? []} />
        </main>

        <div className="hidden lg:block">
          <div className="sticky top-30 rounded-lg ">
            <TableOfContent richText={richText} />
          </div>
        </div>
      </div>
    </div>
  );
}
