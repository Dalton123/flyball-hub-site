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
  index?: number;
};

export function CTACard({ card, className, eager, index = 0 }: CTACardProps) {
  const { image, description, title, href } = card ?? {};
  const isInverted = index % 2 === 1;

  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.75rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 xl:h-[410px]",
        isInverted
          ? "border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/10"
          : "border-primary/10 bg-card text-foreground shadow-sm",
        className,
      )}
    >
      {image?.id && (
        <div className="absolute inset-x-0 top-0 z-[1] h-[58%] overflow-hidden rounded-t-[inherit]">
          <SanityImage
            image={image}
            alt={image?.alt || title || "Card image"}
            width={800}
            height={450}
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            className="h-full w-full rounded-t-[inherit] object-cover opacity-95 saturate-95 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-110"
          />
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-t transition-opacity duration-500 group-hover:opacity-70",
              isInverted
                ? "from-primary via-primary/20 to-transparent"
                : "from-card via-card/35 to-transparent",
            )}
          />
        </div>
      )}
      <div
        className={cn(
          "relative z-[2] m-3 flex flex-col space-y-3 rounded-[1.35rem] p-5 duration-500 md:p-6 xl:absolute xl:inset-x-3 xl:bottom-3 xl:group-hover:bottom-5",
          isInverted
            ? "bg-primary/95 text-primary-foreground shadow-2xl shadow-primary/20"
            : "bg-background/95 text-foreground shadow-lg shadow-primary/5 backdrop-blur-sm",
        )}
      >
        <span
          className={cn(
            "h-1.5 w-10 rounded-full transition-all duration-300 group-hover:w-16",
            isInverted ? "bg-secondary" : "bg-primary/70",
          )}
        />
        <h3 className="text-2xl font-black leading-tight tracking-[-0.025em]">
          {title}
        </h3>
        <p
          className={cn(
            "text-sm leading-6 transition-opacity delay-150 duration-300 xl:opacity-80 xl:group-hover:opacity-100",
            isInverted ? "text-primary-foreground/78" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
