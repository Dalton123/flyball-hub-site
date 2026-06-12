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

function getAppBaseUrl() {
  return (
    process.env.FLYBALL_HUB_APP_URL?.replace(/\/$/, "") ??
    "https://app.flyballhub.com"
  );
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function formatDateLabel(rawEvent: Record<string, unknown>) {
  const primaryDate = getString(rawEvent.start_date);
  const secondaryDate = getString(rawEvent.end_date);

  if (!primaryDate) {
    return "Date to be confirmed";
  }

  const start = parseDateOnly(primaryDate);
  if (!start || Number.isNaN(start.getTime())) {
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

  const end = parseDateOnly(secondaryDate);
  if (!end || Number.isNaN(end.getTime())) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} to ${formatter.format(end)}`;
}

function getVenueLabel(rawEvent: Record<string, unknown>) {
  const venue = getObject(rawEvent.venue);
  const name = getString(venue?.name);
  const city = getString(venue?.city);
  const region = getString(venue?.region);
  const country = getString(venue?.country);

  const locationParts = [city, region, country].filter(Boolean);
  if (name && locationParts.length > 0) {
    return `${name}, ${locationParts.join(", ")}`;
  }

  if (name) return name;
  if (locationParts.length > 0) return locationParts.join(", ");

  return "Venue to be confirmed";
}

function getPlacesLabel(rawEvent: Record<string, unknown>) {
  const capacity = getObject(rawEvent.capacity);
  const remainingPlaces = capacity?.remaining_places;

  if (typeof remainingPlaces !== "number") return null;
  if (remainingPlaces <= 0) return "Fully booked";
  if (remainingPlaces === 1) return "1 place left";

  return `${remainingPlaces} places left`;
}

function normalizeEvent(
  rawEvent: unknown,
  fallbackStatus: "live" | "upcoming",
) {
  const event = getObject(rawEvent);
  if (!event) return null;

  const id = getString(event.id);
  if (!id) return null;

  const hostTeam =
    getString(getObject(event.host_team)?.name) ?? "Host team to be confirmed";
  const metadata = getObject(event.metadata);
  const entryStatus = getString(event.entry_status);
  const status = entryStatus === "live" ? "live" : fallbackStatus;

  const detailUrl = `${getAppBaseUrl()}/public-events/${id}`;

  return {
    id,
    name: getString(event.name) ?? getString(event.title) ?? "Flyball Event",
    description: getString(event.description),
    status,
    dateLabel: formatDateLabel(event),
    venue: getVenueLabel(event),
    hostTeam,
    league: getString(metadata?.league),
    placesLabel: getPlacesLabel(event),
    detailUrl,
  } satisfies PublicEvent;
}

async function fetchEvents(
  status: "live" | "accepting",
  limit: number,
  displayStatus: "live" | "upcoming",
) {
  try {
    const response = await fetch(
      `${getAppBaseUrl()}/api/v1/public-events?status=${status}&limit=${limit}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        data: [],
        error: `The ${displayStatus} events feed returned ${response.status}.`,
      } satisfies FetchEventsResult;
    }

    const json = (await response.json()) as EventsApiResponse;
    const normalizedEvents = (json.data ?? [])
      .map((event) => normalizeEvent(event, displayStatus))
      .filter((event): event is PublicEvent => event !== null);

    return { data: normalizedEvents, error: null } satisfies FetchEventsResult;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected events API error.";

    return {
      data: [],
      error: `The ${displayStatus} events feed could not be reached: ${message}`,
    } satisfies FetchEventsResult;
  }
}

function getPageError(errors: Array<string | null>) {
  const messages = errors.filter((error): error is string => Boolean(error));
  return messages.length > 0 ? messages.join(" ") : null;
}

export default async function PublicEventsPage() {
  const [liveResult, upcomingResult] = await Promise.all([
    fetchEvents("live", 10, "live"),
    fetchEvents("accepting", 20, "upcoming"),
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
