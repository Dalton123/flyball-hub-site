"use client";

import { cn } from "@workspace/ui/lib/utils";

import type { BreedStats } from "@/types";

interface BreedStatsCardProps {
  stats: BreedStats | null;
  className?: string;
}

function StatRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span
      className="text-amber-500 tracking-wider"
      aria-label={`${value} out of ${max}`}
    >
      {"★".repeat(value)}
      {"☆".repeat(max - value)}
    </span>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "muted" && "bg-muted text-muted-foreground",
        variant === "default" && "bg-primary/10 text-primary"
      )}
    >
      {children}
    </span>
  );
}

export function BreedStatsCard({ stats, className }: BreedStatsCardProps) {
  if (!stats) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-3">Breed Stats</h3>
      <div className="space-y-1">
        <StatRow label="Size">{stats.size}</StatRow>
        {stats.energy && (
          <StatRow label="Energy">
            <StarRating value={stats.energy} />
          </StatRow>
        )}
        {stats.trainability && (
          <StatRow label="Trainability">
            <StarRating value={stats.trainability} />
          </StatRow>
        )}
        <StatRow label="Speed">{stats.speed}</StatRow>
        <StatRow label="Height Dog">
          {stats.heightDog ? (
            <Badge variant="success">Yes</Badge>
          ) : (
            <Badge variant="muted">No</Badge>
          )}
        </StatRow>
      </div>
    </div>
  );
}
