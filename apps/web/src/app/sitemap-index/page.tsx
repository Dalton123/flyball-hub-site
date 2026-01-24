import type { Metadata } from "next";
import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { queryHtmlSitemapData } from "@/lib/sanity/query";
import { cleanText } from "@/utils";

interface SitemapPage {
  title: string | null;
  slug: string | null;
}

interface SitemapBlog {
  title: string | null;
  slug: string | null;
  publishedAt: string | null;
}

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse all pages and blog posts on Flyball Hub.",
};

function normalizeSlug(slug: string | null): string {
  if (!slug) return "/";
  // Remove leading slashes and ensure single leading slash
  const cleaned = slug.replace(/^\/+/, "");
  return `/${cleaned}`;
}

export default async function SitemapIndexPage() {
  const { data } = await sanityFetch({ query: queryHtmlSitemapData });

  const pages = (data?.pages ?? []) as SitemapPage[];
  const blogs = (data?.blogs ?? []) as SitemapBlog[];

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sitemap
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete list of all pages on Flyball Hub.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">
              Main Pages
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Blog
                </Link>
              </li>
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={normalizeSlug(page.slug)}
                    className="text-primary hover:underline underline-offset-4"
                  >
                    {cleanText(page.title ?? page.slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">
              Blog Posts
            </h2>
            {blogs.length > 0 ? (
              <ul className="space-y-3">
                {blogs.map((blog) => (
                  <li
                    key={blog.slug}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-3"
                  >
                    <Link
                      href={normalizeSlug(blog.slug)}
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {cleanText(blog.title ?? blog.slug)}
                    </Link>
                    {blog.publishedAt && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(blog.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No blog posts yet.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
