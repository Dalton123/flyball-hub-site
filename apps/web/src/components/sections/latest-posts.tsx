import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { BlogCard } from "../blog-card";

export type LatestPostsProps = PagebuilderType<"latestPosts">;

export function LatestPosts({
  eyebrow,
  title,
  description,
  posts,
  postsCount,
  showViewAll,
}: LatestPostsProps) {
  if (!posts?.length) {
    return null;
  }

  // Limit posts to the configured count (default 3)
  const displayPosts = posts.slice(0, postsCount ?? 3);

  return (
    <section className="field-light-section py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        {(eyebrow || title || description) && (
          <div className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div className="space-y-4">
              {eyebrow && <span className="section-kicker">{eyebrow}</span>}
              {title && <h2 className="section-heading-compact">{title}</h2>}
            </div>
            {description && (
              <p className="editorial-copy max-w-2xl md:justify-self-end">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post, index) => (
            <BlogCard key={post._id} blog={post} eager={index < 3} />
          ))}
        </div>

        {/* View All Link */}
        {showViewAll && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/45 px-5 py-3 font-black text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              View all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
