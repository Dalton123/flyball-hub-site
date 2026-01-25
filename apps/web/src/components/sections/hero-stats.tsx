"use client";

interface HeroStatsProps {
  stats: Array<{ value: string; label: string }> | null | undefined;
}

export function HeroStats({ stats }: HeroStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="mt-12 lg:mt-16 flex flex-wrap gap-8 lg:gap-12">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center lg:items-start opacity-0 animate-float-in-up"
          style={{
            animationDelay: `${700 + i * 100}ms`,
            animationFillMode: "forwards",
          }}
        >
          <div className="text-3xl lg:text-4xl font-bold text-primary font-hero">
            {stat.value}
          </div>
          <div className="text-sm lg:text-base text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
