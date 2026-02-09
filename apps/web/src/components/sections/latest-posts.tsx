import { Badge } from "@workspace/ui/components/badge";
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
    <section className="pt-8 pb-4">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        {(eyebrow || title || description) && (
          <div className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-1.5 text-sm font-medium"
              >
                {eyebrow}
              </Badge>
            )}
            {title && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-balance">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <BlogCard key={post._id} blog={post} />
          ))}
        </div>

        {/* View All Link */}
        {showViewAll && (
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
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
