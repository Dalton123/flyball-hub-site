"use client";

import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { type PublicEvent, PublicEventCard } from "./public-event-card";

interface PublicEventListProps {
  liveEvents: PublicEvent[];
  upcomingEvents: PublicEvent[];
  error: string | null;
}

export function PublicEventList(props: PublicEventListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  if (isPending) {
    return <PublicEventListSkeleton />;
  }

  const { liveEvents, upcomingEvents, error } = props;
  const hasEvents = liveEvents.length > 0 || upcomingEvents.length > 0;

  if (!hasEvents && error) {
    return (
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-2xl justify-items-center gap-4 rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <div className="grid gap-2">
            <h2 className="text-2xl font-semibold">We could not load events</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button
            type="button"
            size="lg"
            className="min-h-11 rounded-xl px-6"
            onClick={handleRetry}
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  if (!hasEvents) {
    return (
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border bg-muted/30 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold">No public events right now</h2>
          <p className="mt-3 text-muted-foreground">
            Check back soon for new tournament weekends and live competition
            updates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      {error && (
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 md:flex-row md:items-center md:justify-between md:px-5">
          <p>
            Some event data could not be refreshed. Showing the results we could
            load.
          </p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-h-11 rounded-xl"
            onClick={handleRetry}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      )}

      {liveEvents.length > 0 && (
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="size-3 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-2xl font-semibold md:text-3xl">Live Now</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {liveEvents.map((event) => (
              <PublicEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Upcoming Events
          </h2>
          <p className="text-sm text-muted-foreground">
            {upcomingEvents.length} listed
          </p>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <PublicEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-muted/30 px-6 py-10 text-center">
            <p className="text-muted-foreground">
              There are no upcoming public events listed yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function PublicEventListSkeleton() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mb-12">
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`live-skeleton-${index}`}
              className="rounded-3xl border p-6 shadow-sm"
            >
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
              <div className="mt-5 h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-6 h-11 animate-pulse rounded-xl bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`upcoming-skeleton-${index}`}
              className="rounded-3xl border p-6 shadow-sm"
            >
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
              <div className="mt-5 h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
              <div className="mt-6 h-11 animate-pulse rounded-xl bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
