"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Grade } from "@/types";

const GRADE_COLOR: Record<Grade, string> = {
  A: "#4ade80",
  B: "#a3e635",
  C: "#f0b27a",
  D: "#fb923c",
  F: "#f87171",
};

export function ScoreRing({ score, grade }: { score: number; grade: Grade }) {
  const [mounted, setMounted] = useState(false);
  const color = GRADE_COLOR[grade];
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative h-24 w-24 shrink-0"
      role="img"
      aria-label={`Score: ${score} out of 100, Grade: ${grade}`}
    >
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          className="stroke-fg/[0.06]"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-bold leading-none tabular-nums"
          style={{ color, opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}
        >
          {score}
        </span>
        <span
          className={clsx("text-xs font-semibold mt-0.5")}
          style={{ color, opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.7s" }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
