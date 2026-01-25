import Link from "next/link";

import type { BlogCardProps } from "@/types";
import { cleanText } from "@/utils";

import { SanityImage } from "./elements/sanity-image";

interface RelatedPostsProps {
  posts: BlogCardProps[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border pt-16">
      {/* Section Header */}
      <div className="mb-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Continue Reading
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {posts.slice(0, 2).map((post, index) => (
          <RelatedPostCard key={post._id} post={post} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}

function RelatedPostCard({
  post,
  featured = false,
}: {
  post: BlogCardProps;
  featured?: boolean;
}) {
  const { title, slug, image, publishedAt, authors } = post;

  return (
    <article className="group relative">
      <Link href={slug ?? "#"} className="block">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
          {image?.id && (
            <SanityImage
              image={image}
              width={800}
              height={500}
              alt={cleanText(title) || "Related post"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {/* Meta */}
            <div className="mb-3 flex items-center gap-2 text-xs text-white/80">
              {publishedAt && (
                <time dateTime={publishedAt}>
                  {new Date(publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              )}
              {authors?.name && (
                <>
                  <span className="text-white/40">•</span>
                  <span>{cleanText(authors.name)}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3
              className={`font-semibold leading-tight text-white ${
                featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
              }`}
            >
              {cleanText(title)}
            </h3>
          </div>
        </div>

        {/* Hover ring effect */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-xl" />
      </Link>
    </article>
  );
}
