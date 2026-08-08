import { Badge } from "@workspace/ui/components/badge";
import { ExternalLink } from "lucide-react";

import type { OrganisationPageData } from "@/types";

import { RichText } from "./elements/rich-text";
import { SanityImage } from "./elements/sanity-image";
import { OrganisationFactsCard } from "./organisation-facts-card";
import { OrganisationLinks } from "./organisation-links";

interface OrganisationPageProps {
  organisation: OrganisationPageData;
}

const typeLabels = {
  league: "Flyball league",
  governingBody: "Governing body",
  sanctioningBody: "Sanctioning body",
  other: "Flyball organisation",
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function OrganisationPage({ organisation }: OrganisationPageProps) {
  const {
    name,
    shortName,
    summary,
    organisationType,
    region,
    countries,
    foundedYear,
    status,
    heroImage,
    quickFacts,
    officialLinks,
    officialSources,
    lastVerifiedAt,
    richText,
  } = organisation;
  const verifiedDate = formatDate(lastVerifiedAt);

  return (
    <main className="container mx-auto px-4 pb-16 md:px-6 md:pb-24">
      <header className="py-8 md:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">
                {typeLabels[organisationType ?? "other"]}
              </Badge>
              {status && (
                <span className="text-sm capitalize text-muted-foreground">
                  {status}
                </span>
              )}
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              {shortName}
            </p>
            <h1 className="mt-2 max-w-3xl text-4xl font-semibold leading-tight text-balance md:text-5xl lg:text-6xl">
              {name}
            </h1>
            {summary && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                {summary}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {region && <span>{region}</span>}
              {verifiedDate && <span>Facts checked {verifiedDate}</span>}
            </div>
          </div>

          {heroImage?.id ? (
            <SanityImage
              image={heroImage}
              alt={heroImage.alt ?? name ?? "Flyball organisation"}
              width={960}
              height={720}
              loading="eager"
              fetchPriority="high"
              className="aspect-[4/3] h-auto w-full rounded-3xl object-cover shadow-lg"
            />
          ) : (
            <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-muted shadow-sm">
              <div className="text-center">
                <p className="text-6xl font-semibold tracking-tight text-primary md:text-7xl">
                  {shortName ?? name?.slice(0, 3).toUpperCase() ?? "ORG"}
                </p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  {region ?? "Flyball organisation"}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-14">
          {richText && richText.length > 0 && (
            <article aria-label={`${name ?? "Organisation"} guide`}>
              <RichText richText={richText} />
            </article>
          )}
          <OrganisationLinks links={officialLinks} />

          {officialSources && officialSources.length > 0 && (
            <section
              aria-labelledby="verification-sources-heading"
              className="rounded-2xl bg-muted/45 p-5 md:p-6"
            >
              <h2
                id="verification-sources-heading"
                className="text-xl font-semibold"
              >
                Verification sources
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Flyball Hub checked the stable facts on this page against these
                first-party sources.
              </p>
              <ul className="mt-4 grid gap-3">
                {officialSources.flatMap((source) =>
                  source.label && source.url
                    ? [
                        <li key={source._key}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {source.label}
                            <ExternalLink
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          </a>
                        </li>,
                      ]
                    : [],
                )}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24">
          <OrganisationFactsCard
            facts={quickFacts}
            foundedYear={foundedYear}
            region={region}
            countries={countries}
          />
        </aside>
      </div>
    </main>
  );
}
