import { createElement, ComponentType } from "react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import clsx from "clsx";
import type { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type IconType = typeof CheckCircle2 | typeof AlertTriangle | typeof XCircle;

export function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: IconType;
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 rise-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={clsx("flex h-9 w-9 items-center justify-center rounded-md", color)}>
        {createElement(icon, { size: 16 })}
      </span>
      <div>
        <AnimatedCounter value={value} className="text-lg font-semibold tabular-nums leading-none" />
        <p className="text-xs text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}
