"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

interface BreedProsConsProps {
  pros: string[] | null;
  cons: string[] | null;
  className?: string;
}

export function BreedProsCons({ pros, cons, className }: BreedProsConsProps) {
  if (!pros?.length && !cons?.length) return null;

  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {pros && pros.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
            <CheckCircle2 className="size-5" />
            Pros
          </h3>
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-green-900"
              >
                <span className="text-green-600">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons && cons.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-red-800 mb-3">
            <XCircle className="size-5" />
            Cons
          </h3>
          <ul className="space-y-2">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-red-900">
                <span className="text-red-600">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
