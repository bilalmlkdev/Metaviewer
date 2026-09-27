"use client";

import { Suspense, type ElementType } from "react";
import { useAnalyzing } from "@/hooks/useAnalyzing";
import { AlertCircle, CheckCircle2, Globe, ScanSearch, ListChecks, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";

const ICON_COMPONENTS: ElementType[] = [Globe, ScanSearch, ListChecks];

function AnalyzingScreen() {
  const { error, step, allDone, progress, elapsed, url } = useAnalyzing();

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-6">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle size={24} /></span>
        <div><p className="text-lg text-fg mb-1">Analysis failed</p><p className="text-sm text-muted max-w-sm">{error}</p></div>
        <a href="/" className="h-10 px-5 rounded-lg border border-border bg-surface shadow-xs text-sm text-fg hover:bg-fg/5 transition-colors">Back to homepage</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 text-center px-6">
      <Logo className="h-10 w-10 text-accent opacity-80" />

      <div className="w-full max-w-sm">
        <p className="text-lg text-fg mb-1">Analyzing <span className="text-accent font-mono text-base">{url.replace(/^https?:\/\//, "")}</span></p>
        <p className="text-sm text-muted flex items-center justify-center gap-2">
          Fetching, parsing, and scoring this page.
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted/60 tabular-nums"><Clock size={11} />{(elapsed / 1000).toFixed(1)}s</span>
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-accent transition-all duration-300 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {[0, 1, 2].map((i) => {
          const done = i < step || (allDone && i <= step);
          const active = i === step && !allDone;
          const Icon = ICON_COMPONENTS[i] ?? Globe;
          return (
            <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${done || active ? "text-fg" : "text-muted/40"}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${done ? "bg-accent border-accent text-black scale-100" : active ? "border-accent text-accent animate-pulse" : "border-border text-muted/40"}`}>
                {done ? <CheckCircle2 size={15} /> : <Icon size={14} />}
              </span>
              <span className={active ? "text-fg" : ""}>{["Fetching the page", "Parsing meta tags", "Scoring & building previews"][i]}</span>
              {active && <span className="ml-auto flex gap-0.5"><span className="h-1 w-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} /><span className="h-1 w-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} /><span className="h-1 w-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} /></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AnalyzingScreen />
    </Suspense>
  );
}
