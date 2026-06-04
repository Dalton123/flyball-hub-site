import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "./elements/sanity-image";

type ImageLinkCard = NonNullable<
  NonNullable<PagebuilderType<"imageLinkCards">["cards"]>
>[number];

export type CTACardProps = {
  card: ImageLinkCard;
  className?: string;
  eager?: boolean;
};

export function CTACard({ card, className, eager }: CTACardProps) {
  const { image, description, title, href } = card ?? {};
  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[1.75rem] p-5 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 md:p-7 xl:h-[410px]",
        className,
      )}
    >
      {image?.id && (
        <div className="absolute inset-0 z-[1] overflow-hidden rounded-[inherit]">
          <SanityImage
            image={image}
            alt={image?.alt || title || "Card image"}
            width={800}
            height={450}
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            className="h-full w-full rounded-[inherit] object-cover opacity-60 saturate-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70 group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/75 to-background/5" />
        </div>
      )}
      <div className="z-[2] flex flex-col space-y-3 duration-500 xl:absolute xl:inset-x-7 xl:bottom-7 xl:group-hover:bottom-9">
        <span className="h-1.5 w-12 rounded-full bg-secondary transition-all duration-300 group-hover:w-20" />
        <h3 className="text-2xl font-black leading-tight tracking-[-0.025em] text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground transition-opacity duration-300 delay-150 xl:opacity-75 xl:group-hover:opacity-100">
          {description}
        </p>
      </div>
    </Link>
  );
}
