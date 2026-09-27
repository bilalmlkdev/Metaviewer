import clsx from "clsx";
import type { Grade } from "@/types";

const GRADE_STYLES: Record<Grade, string> = {
  A: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  B: "text-lime-400 bg-lime-500/10 border-lime-500/20",
  C: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  D: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  F: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function GradeBadge({ grade }: { grade: Grade }) {
  return (
    <span className={clsx("inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-bold", GRADE_STYLES[grade])}>
      {grade}
    </span>
  );
}
