import type { OrganisationQuickFacts } from "@/types";

interface OrganisationFactsCardProps {
  facts: OrganisationQuickFacts | null;
  foundedYear: number | null;
  region: string | null;
  countries: string[] | null;
}

const factLabels: Array<[keyof OrganisationQuickFacts, string]> = [
  ["geographicCoverage", "Coverage"],
  ["competitionModel", "Competition model"],
  ["membershipModel", "Membership"],
  ["titleProgrammes", "Titles and awards"],
  ["flagshipEvent", "Flagship event"],
];

export function OrganisationFactsCard({
  facts,
  foundedYear,
  region,
  countries,
}: OrganisationFactsCardProps) {
  const rows = [
    ...(region ? [["Primary region", region] as const] : []),
    ...(countries?.length
      ? [["Countries served", countries.join(", ")] as const]
      : []),
    ...(foundedYear ? [["Established", String(foundedYear)] as const] : []),
    ...factLabels.flatMap(([key, label]) => {
      const value = facts?.[key];
      return value ? ([[label, value]] as const) : [];
    }),
  ];

  if (!rows.length) return null;

  return (
    <section
      aria-labelledby="organisation-facts-heading"
      className="rounded-2xl bg-muted/55 p-5 md:p-6"
    >
      <h2 id="organisation-facts-heading" className="text-xl font-semibold">
        At a glance
      </h2>
      <dl className="mt-5 grid gap-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-background p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-medium leading-6 text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
