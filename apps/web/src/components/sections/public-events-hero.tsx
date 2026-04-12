import { Badge } from "@workspace/ui/components/badge";

import { BackgroundPattern } from "../elements/background-pattern";

interface PublicEventsHeroProps {
  liveCount: number;
  upcomingCount: number;
}

export function PublicEventsHero({
  liveCount,
  upcomingCount,
}: PublicEventsHeroProps) {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <BackgroundPattern pattern="tennis-balls" opacity={0.03} />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="relative mb-6 overflow-hidden px-4 py-1.5 text-sm font-medium"
          >
            <span className="relative z-10">Watch Flyball In Person</span>
            <span className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </Badge>
          <h1 className="mb-6 text-balance text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Find Flyball Events Near You
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            Discover public flyball tournaments and live competition weekends.
            See what is happening now, plan a visit, and follow links for full
            event details.
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border bg-background/80 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-3xl font-semibold text-primary">{liveCount}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                live event{liveCount === 1 ? "" : "s"} happening now
              </p>
            </div>
            <div className="rounded-3xl border bg-background/80 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-3xl font-semibold text-primary">
                {upcomingCount}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                upcoming event{upcomingCount === 1 ? "" : "s"} to explore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
