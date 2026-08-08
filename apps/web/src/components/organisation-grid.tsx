import type { OrganisationCardData } from "@/types";

import { OrganisationCard } from "./organisation-card";

interface OrganisationGridProps {
  organisations: OrganisationCardData[];
}

export function OrganisationGrid({ organisations }: OrganisationGridProps) {
  if (!organisations.length) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {organisations.map((organisation, index) => (
        <OrganisationCard
          key={organisation._id}
          organisation={organisation}
          eager={index < 3}
        />
      ))}
    </div>
  );
}
