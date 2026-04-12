import { PublicEventListSkeleton } from "@/components/sections/public-event-list";
import { PublicEventsHero } from "@/components/sections/public-events-hero";

export default function Loading() {
  return (
    <main className="bg-background">
      <PublicEventsHero liveCount={0} upcomingCount={0} />
      <PublicEventListSkeleton />
    </main>
  );
}
