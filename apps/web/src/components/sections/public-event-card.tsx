import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarDays, ExternalLink, MapPin, Shield } from "lucide-react";
import Link from "next/link";

export interface PublicEvent {
  id: string;
  name: string;
  slug: string;
  status: "live" | "upcoming";
  dateLabel: string;
  venue: string;
  hostTeam: string;
}

interface PublicEventCardProps {
  event: PublicEvent;
}

export function PublicEventCard({ event }: PublicEventCardProps) {
  const isLive = event.status === "live";

  return (
    <article className="grid h-full rounded-3xl border bg-background p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <Badge
          variant={isLive ? "default" : "secondary"}
          className={cn(
            "px-3 py-1 text-xs font-medium",
            isLive && "bg-green-600 text-white hover:bg-green-600",
          )}
        >
          {isLive ? (
            <>
              <span className="size-2 rounded-full bg-white/90 animate-pulse" />
              Live
            </>
          ) : (
            "Upcoming"
          )}
        </Badge>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-2">
          <h3 className="text-2xl font-semibold leading-tight text-balance">
            {event.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Public event details, location, and schedule are available in the
            Flyball Hub app.
          </p>
        </div>

        <dl className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <dt className="sr-only">Date</dt>
              <dd>{event.dateLabel}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <dt className="sr-only">Venue</dt>
              <dd>{event.venue}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <dt className="sr-only">Host Team</dt>
              <dd>{event.hostTeam}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <Button asChild size="lg" className="min-h-11 w-full rounded-xl">
          <Link
            href={`https://app.flyballhub.com/events/${event.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            View Event
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
