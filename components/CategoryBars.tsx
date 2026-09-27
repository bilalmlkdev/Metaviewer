"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { CategoryScore } from "@/types";

function barColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-accent";
  if (pct > 0) return "bg-orange-600";
  return "bg-red-500/70";
}

function textColor(pct: number): string {
  if (pct >= 80) return "text-emerald-400";
  if (pct >= 50) return "text-accent";
  if (pct > 0) return "text-orange-400";
  return "text-red-400";
}

export function CategoryBars({ categories }: { categories: CategoryScore[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mt-6 pt-6 border-t border-border/60">
      {categories.map((c, i) => {
        const pct = c.possible === 0 ? 0 : (c.earned / c.possible) * 100;
        return (
          <div key={c.category} className="group">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs text-muted">{c.label}</span>
              <span className={clsx("text-xs font-medium tabular-nums", textColor(pct))}>
                {Math.round(pct)}%
              </span>
            </div>
            <div className="text-sm font-medium mb-2 tabular-nums">
              {c.earned}
              <span className="text-muted/60">/{c.possible}</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${c.label}: ${Math.round(pct)}%`}
              className="h-1.5 rounded-full bg-fg/5 overflow-hidden"
            >
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  barColor(pct)
                )}
                style={{
                  width: mounted ? `${Math.max(pct, 3)}%` : "0%",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
