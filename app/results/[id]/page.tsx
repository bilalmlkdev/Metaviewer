"use client";

import { useRef, useState } from "react";
import { useResult } from "@/hooks/useResult";
import { ResultHeader } from "@/components/results/ResultHeader";
import { ScoreOverview } from "@/components/results/ScoreOverview";
import { ResultTabs, type TabId } from "@/components/results/ResultTabs";
import { PreviewsTab } from "@/components/results/PreviewsTab";
import { BasicTab } from "@/components/results/BasicTab";
import { OpenGraphTab } from "@/components/results/OpenGraphTab";
import { TwitterTab } from "@/components/results/TwitterTab";
import { ImagesTab } from "@/components/results/ImagesTab";
import { RawTab } from "@/components/results/RawTab";
import { ScoreTab } from "@/components/results/ScoreTab";
import { Loader2, XCircle } from "lucide-react";

export default function ResultsPage() {
  const { result, error, reanalyzing, copied, reanalyze, share, goBack, goHistory } = useResult();
  const [tab, setTab] = useState<TabId>("previews");
  const scoreCardRef = useRef<HTMLDivElement>(null);

  if (error && !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-6">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <XCircle size={24} />
        </span>
        <div>
          <p className="text-lg text-fg mb-1">Result not found</p>
          <p className="text-sm text-muted max-w-sm">{error}</p>
        </div>
        <button onClick={goBack} className="h-10 px-5 rounded-lg bg-accent text-black font-medium text-sm hover:bg-accent-light transition-colors">
          Run a new analysis
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent" size={28} />
        <p className="text-sm text-muted">Loading result…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ResultHeader
        result={result}
        reanalyzing={reanalyzing}
        copied={copied}
        scoreCardRef={scoreCardRef}
        onReanalyze={reanalyze}
        onShare={share}
        onGoBack={goBack}
        onGoHistory={goHistory}
      />

      {error && result && (
        <div className="px-6 pt-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <main className="px-6 py-6 max-w-6xl mx-auto">
        <ScoreOverview result={result} cardRef={scoreCardRef} />

        <ResultTabs active={tab} onChange={setTab} />

        <div key={tab}>
          {tab === "previews" && <PreviewsTab result={result} />}
          {tab === "basic" && <BasicTab result={result} />}
          {tab === "opengraph" && <OpenGraphTab result={result} />}
          {tab === "twitter" && <TwitterTab result={result} />}
          {tab === "images" && <ImagesTab result={result} />}
          {tab === "raw" && <RawTab result={result} />}
          {tab === "score" && <ScoreTab result={result} />}
        </div>
      </main>
    </div>
  );
}
