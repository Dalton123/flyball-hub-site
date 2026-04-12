import type { Metadata } from "next";

import type { PublicEvent } from "@/components/sections/public-event-card";
import { PublicEventList } from "@/components/sections/public-event-list";
import { PublicEventsHero } from "@/components/sections/public-events-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Public Flyball Events | Flyball Hub",
  description:
    "Find live and upcoming flyball events, browse public competition weekends, and open full event details in Flyball Hub.",
  openGraph: {
    title: "Public Flyball Events | Flyball Hub",
    description:
      "Find live and upcoming flyball events, browse public competition weekends, and open full event details in Flyball Hub.",
    url: "/public-events",
    type: "website",
  },
};

interface EventsApiResponse {
  data?: unknown[];
}

interface FetchEventsResult {
  data: PublicEvent[];
  error: string | null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function getObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function formatDateLabel(rawEvent: Record<string, unknown>) {
  const primaryDate =
    getString(rawEvent.start_date) ??
    getString(rawEvent.starts_at) ??
    getString(rawEvent.date) ??
    getString(rawEvent.event_date);

  const secondaryDate =
    getString(rawEvent.end_date) ?? getString(rawEvent.ends_at);

  if (!primaryDate) {
    return "Date to be confirmed";
  }

  const start = new Date(primaryDate);
  if (Number.isNaN(start.getTime())) {
    return primaryDate;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!secondaryDate) {
    return formatter.format(start);
  }

  const end = new Date(secondaryDate);
  if (Number.isNaN(end.getTime())) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} to ${formatter.format(end)}`;
}

function normalizeEvent(rawEvent: unknown, status: "live" | "upcoming") {
  const event = getObject(rawEvent);
  if (!event) return null;

  const slug = getString(event.slug);
  if (!slug) return null;

  const venue =
    getString(event.venue_name) ??
    getString(event.location_name) ??
    getString(getObject(event.venue)?.name) ??
    "Venue to be confirmed";

  const hostTeam =
    getString(event.host_team_name) ??
    getString(getObject(event.host_team)?.name) ??
    getString(event.organizer_name) ??
    "Host team to be confirmed";

  return {
    id: getString(event.id) ?? `${status}-${slug}`,
    name: getString(event.name) ?? getString(event.title) ?? "Flyball Event",
    slug,
    status,
    dateLabel: formatDateLabel(event),
    venue,
    hostTeam,
  } satisfies PublicEvent;
}

async function fetchEvents(status: "live" | "upcoming", limit: number) {
  try {
    const response = await fetch(
      `https://app.flyballhub.com/api/v1/events?status=${status}&limit=${limit}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        data: [],
        error: `The ${status} events feed returned ${response.status}.`,
      } satisfies FetchEventsResult;
    }

    const json = (await response.json()) as EventsApiResponse;
    const normalizedEvents = (json.data ?? [])
      .map((event) => normalizeEvent(event, status))
      .filter((event): event is PublicEvent => event !== null);

    return { data: normalizedEvents, error: null } satisfies FetchEventsResult;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected events API error.";

    return {
      data: [],
      error: `The ${status} events feed could not be reached: ${message}`,
    } satisfies FetchEventsResult;
  }
}

function getPageError(errors: Array<string | null>) {
  const messages = errors.filter((error): error is string => Boolean(error));
  return messages.length > 0 ? messages.join(" ") : null;
}

export default async function PublicEventsPage() {
  const [liveResult, upcomingResult] = await Promise.all([
    fetchEvents("live", 10),
    fetchEvents("upcoming", 20),
  ]);

  const { data: liveEvents, error: liveError } = liveResult;
  const { data: upcomingEvents, error: upcomingError } = upcomingResult;

  return (
    <main className="bg-background">
      <PublicEventsHero
        liveCount={liveEvents.length}
        upcomingCount={upcomingEvents.length}
      />
      <PublicEventList
        liveEvents={liveEvents}
        upcomingEvents={upcomingEvents}
        error={getPageError([liveError, upcomingError])}
      />
    </main>
  );
}
