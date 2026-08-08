import Link from "next/link";

import type { OrganisationCardData } from "@/types";

import { SanityImage } from "./elements/sanity-image";

interface OrganisationCardProps {
  organisation: OrganisationCardData;
  eager?: boolean;
}

const typeLabels = {
  league: "League",
  governingBody: "Governing body",
  sanctioningBody: "Sanctioning body",
  other: "Organisation",
};

export function OrganisationCard({
  organisation,
  eager,
}: OrganisationCardProps) {
  const {
    name,
    shortName,
    slug,
    summary,
    organisationType,
    region,
    heroImage,
  } = organisation;
  const href = slug ?? "/organisations";

  return (
    <article className="group overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70 transition-shadow hover:shadow-lg">
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-primary/8">
          {heroImage?.id ? (
            <SanityImage
              image={heroImage}
              alt={heroImage.alt ?? name ?? "Flyball organisation"}
              width={720}
              height={405}
              loading={eager ? "eager" : undefined}
              fetchPriority={eager ? "high" : undefined}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-primary/15 via-primary/5 to-background">
              <span className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">
                {shortName ?? name?.slice(0, 3).toUpperCase() ?? "ORG"}
              </span>
            </div>
          )}
        </div>
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
            <span>{typeLabels[organisationType ?? "other"]}</span>
            {region && <span aria-hidden="true">·</span>}
            {region && <span>{region}</span>}
          </div>
          <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary">
            {name}
          </h2>
          {summary && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {summary}
            </p>
          )}
          <span className="mt-5 inline-flex text-sm font-semibold text-primary">
            View organisation guide
          </span>
        </div>
      </Link>
    </article>
  );
}
