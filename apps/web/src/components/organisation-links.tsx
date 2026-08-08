import { ExternalLink } from "lucide-react";

import type { OrganisationLink } from "@/types";

interface OrganisationLinksProps {
  links: OrganisationLink[] | null;
}

const categoryLabels: Record<string, string> = {
  officialSite: "Official website",
  rules: "Rules",
  joinRegister: "Join or register",
  events: "Events",
  results: "Results",
  records: "Records",
  titles: "Titles and awards",
  teamClubFinder: "Team or club finder",
  contact: "Contact",
  other: "Official resource",
};

function formatVerifiedDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function OrganisationLinks({ links }: OrganisationLinksProps) {
  const validLinks = (links ?? []).filter(
    (link): link is OrganisationLink & { label: string; url: string } =>
      Boolean(link.label && link.url),
  );

  if (!validLinks.length) return null;

  return (
    <section aria-labelledby="official-links-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          First-party resources
        </p>
        <h2
          id="official-links-heading"
          className="mt-2 text-2xl font-semibold md:text-3xl"
        >
          Official links
        </h2>
        <p className="mt-3 text-muted-foreground">
          Use these verified organisation resources for current rules, events,
          results and participation details.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {validLinks.map((link) => {
          const verified = formatVerifiedDate(link.verifiedAt);
          return (
            <a
              key={link._key}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl bg-muted/55 p-5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {categoryLabels[link.category ?? ""] ?? "Official resource"}
                  </p>
                  <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </h3>
                </div>
                <ExternalLink
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground"
                />
              </div>
              {link.accessNote && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {link.accessNote}
                </p>
              )}
              {verified && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Link checked {verified}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
