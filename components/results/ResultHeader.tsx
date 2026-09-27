"use client";

import { Tooltip } from "@/components/Tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportMenu } from "@/components/ExportMenu";
import type { AnalysisResult } from "@/types";
import {
  ArrowLeft, RefreshCw, Share2, Plus, ExternalLink,
  Loader2, Check, History,
} from "lucide-react";

interface ResultHeaderProps {
  result: AnalysisResult;
  reanalyzing: boolean;
  copied: boolean;
  scoreCardRef: React.RefObject<HTMLDivElement>;
  onReanalyze: () => void;
  onShare: () => void;
  onGoBack: () => void;
  onGoHistory: () => void;
}

export function ResultHeader({
  result, reanalyzing, copied, scoreCardRef,
  onReanalyze, onShare, onGoBack, onGoHistory,
}: ResultHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border/60 sticky top-0 z-30 bg-background/80 backdrop-blur-lg">
      <div className="w-full max-w-[1100px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Tooltip label="Go back">
            <button onClick={onGoBack} aria-label="Go back" className="text-muted hover:text-fg transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Tooltip>
          <a href={result.finalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm truncate hover:underline">
            {result.finalUrl.replace(/^https?:\/\//, "")}
            <ExternalLink size={13} className="shrink-0" />
          </a>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Tooltip label="Re-analyze this URL">
            <button onClick={onReanalyze} disabled={reanalyzing} className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border shadow-xs text-sm text-muted hover:text-fg transition-colors disabled:opacity-60">
              {reanalyzing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Re-analyze
            </button>
          </Tooltip>
          <Tooltip label={copied ? "Link copied!" : "Share this result"}>
            <button onClick={onShare} className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border shadow-xs text-sm text-muted hover:text-fg transition-colors">
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copied ? "Copied" : "Share"}
            </button>
          </Tooltip>
          <ExportMenu result={result} captureRef={scoreCardRef} />
          <Tooltip label="View history">
            <button onClick={onGoHistory} className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border shadow-xs text-sm text-muted hover:text-fg transition-colors">
              <History size={14} /> History
            </button>
          </Tooltip>
          <Tooltip label="Toggle theme"><ThemeToggle /></Tooltip>
          <button onClick={onGoBack} className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-fg shadow-xs text-background text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={14} /> New Analysis
          </button>
        </div>
      </div>
    </header>
  );
}
