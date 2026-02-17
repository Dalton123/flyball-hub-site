"use client";

import { Target, Timer, Zap } from "lucide-react";

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/use-scroll-animation";

const TRAITS = [
  {
    icon: Target,
    title: "Ball Drive",
    description:
      "If your dog loses their mind over a tennis ball, you're halfway there. Ball-obsessed dogs learn flyball faster because the reward is built into the sport itself.",
  },
  {
    icon: Zap,
    title: "Speed & Agility",
    description:
      "Flyball lanes are only 51 feet long, so explosive acceleration beats raw top speed. The dogs that win races are usually the ones with the tightest box turns and cleanest hurdle clearance.",
  },
  {
    icon: Timer,
    title: "Trainability",
    description:
      "Race day is loud, fast, and chaotic — a dog that can hold a recall under that kind of pressure is worth their weight in gold. Some breeds take to box turns almost immediately; others need more repetition.",
  },
];

export function BreedTraits() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  });
  const { containerRef, visibleItems } = useStaggeredAnimation(TRAITS.length, {
    staggerDelay: 150,
  });

  return (
    <section ref={ref} className="py-12 md:py-16 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`text-center mb-10 md:mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl font-semibold md:text-3xl mb-4">
            What Makes a Good Flyball Dog?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Any breed can run flyball, but dogs with these three traits tend to
            pick it up faster.
          </p>
        </div>
        <div
          ref={containerRef}
          className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
        >
          {TRAITS.map((trait, index) => (
            <div
              key={trait.title}
              className={`rounded-3xl bg-accent/60 border border-border/40 p-6 md:p-8 transition-all duration-500 hover:bg-accent hover:shadow-lg hover:-translate-y-1 ${
                visibleItems[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className="mb-5 flex w-fit p-3 items-center justify-center rounded-2xl bg-background shadow-md">
                <trait.icon className="size-5 text-primary" />
              </span>
              <h3 className="text-lg font-semibold mb-2">{trait.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trait.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
