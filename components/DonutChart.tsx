"use client";

import { useEffect, useRef, useState } from "react";

interface Slice {
  value: number;
  color: string;
  label: string;
}

export function DonutChart({ slices, size = 140 }: { slices: Slice[]; size?: number }) {
  const [mounted, setMounted] = useState(false);
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const gap = 2;
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={ref} viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            className="stroke-fg/[0.06]"
            strokeWidth={strokeWidth}
          />
          {slices.map((s, i) => {
            const pct = s.value / total;
            const dashLength = Math.max(pct * circumference - gap, 0);
            const dashOffset = -(cumulative / total) * circumference;
            cumulative += s.value;
            return (
              <circle
                key={s.label}
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${mounted ? dashLength : 0} ${circumference}`}
                strokeDashoffset={dashOffset}
                style={{
                  transition: `stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">{total}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted">checks</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {slices.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            {s.label} <span className="text-fg font-medium tabular-nums">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
