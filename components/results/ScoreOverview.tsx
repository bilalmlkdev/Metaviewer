import { ScoreRing } from "@/components/ScoreRing";
import { CategoryBars } from "@/components/CategoryBars";
import { DonutChart } from "@/components/DonutChart";
import { StatCard } from "@/components/ui/StatCard";
import type { AnalysisResult } from "@/types";
import { Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ScoreOverviewProps {
  result: AnalysisResult;
  cardRef: React.RefObject<HTMLDivElement>;
}

export function ScoreOverview({ result, cardRef }: ScoreOverviewProps) {
  const errorCount = result.checks.filter((c) => c.status === "error").length;
  const warningCount = result.checks.filter((c) => c.status === "warning").length;
  const passCount = result.checks.filter((c) => c.status === "pass").length;

  return (
    <>
      <div ref={cardRef} className="rounded-xl border border-border bg-surface p-6 mb-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex items-center gap-5">
            <ScoreRing score={result.totalScore} grade={result.grade} />
            <div className="min-w-0">
              <p className="text-lg leading-snug">{result.summary}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(result.fetchedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                {typeof result.meta.loadTimeMs === "number" && (
                  <span className="font-mono tabular-nums">{(result.meta.loadTimeMs / 1000).toFixed(2)}s load</span>
                )}
                <span className="font-mono truncate max-w-[240px]">{result.finalUrl.replace(/^https?:\/\//, "")}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-px self-stretch bg-border/60" />
          <div className="shrink-0">
            <DonutChart slices={[
              { value: passCount, color: "#4ade80", label: "Passed" },
              { value: warningCount, color: "#f0b27a", label: "Warnings" },
              { value: errorCount, color: "#f87171", label: "Errors" },
            ]} />
          </div>
        </div>
        <CategoryBars categories={result.categoryScores} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={CheckCircle2} label="Checks passed" value={passCount} color="bg-emerald-500/10 text-emerald-400" delay={100} />
        <StatCard icon={AlertTriangle} label="Warnings" value={warningCount} color="bg-amber-500/10 text-amber-400" delay={200} />
        <StatCard icon={XCircle} label="Errors" value={errorCount} color="bg-red-500/10 text-red-400" delay={300} />
      </div>
    </>
  );
}
