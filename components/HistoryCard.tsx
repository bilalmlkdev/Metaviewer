"use client";

import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "@/components/Tooltip";
import { Logo } from "@/components/Logo";
import type { HistoryEntry } from "@/lib/localHistory";
import { isValidHttpUrl } from "@/lib/url";
import { Trash2, ExternalLink, Clock } from "lucide-react";

interface HistoryCardProps {
  entry: HistoryEntry;
  onRemove: (id: string) => void;
}

export function HistoryCard({ entry, onRemove }: HistoryCardProps) {
  const displayName = entry.title ?? entry.finalUrl.replace(/^https?:\/\//, "");

  return (
    <div className="group relative rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/40 transition-colors">
      <Link href={`/results/${entry.id}`} className="block">
        <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-background">
          {isValidHttpUrl(entry.ogImage) ? (
            <Image src={entry.ogImage!} alt={entry.title ?? "Preview"} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" unoptimized />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-grid">
              <Logo className="h-16 w-16 text-border" />
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-[11px] font-mono text-white/80">
              <Clock size={11} />
              {new Date(entry.fetchedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
              {typeof entry.loadTimeMs === "number" && (
                <><span className="text-white/40"> · </span>{(entry.loadTimeMs / 1000).toFixed(1)}s</>
              )}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {isValidHttpUrl(entry.favicon) ? (
                <Image src={entry.favicon!} alt="" width={32} height={32} className="rounded-md border border-border bg-background" unoptimized />
              ) : (
                <div className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background">
                  <Logo className="h-4 w-4 text-muted" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-fg truncate">{displayName}</h3>
              <p className="text-xs text-muted mt-0.5 line-clamp-2">
                {entry.description ?? `Analyzed ${entry.finalUrl.replace(/^https?:\/\//, "")}`}
              </p>
            </div>
            <span className="shrink-0 text-lg font-bold tabular-nums text-fg">{entry.score}</span>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/60 text-xs text-muted">
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {entry.passCount}</span>
            <span className="flex items-center gap-1.5 text-amber-400"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> {entry.warningCount}</span>
            <span className="flex items-center gap-1.5 text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-400" /> {entry.errorCount}</span>
            <span className="ml-auto font-mono text-muted/60 truncate max-w-[180px]">{entry.finalUrl.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip label="Open site" side="bottom">
          <a href={entry.finalUrl} target="_blank" rel="noreferrer" aria-label={`Open ${entry.finalUrl} in new tab`} onClick={(ev) => ev.stopPropagation()} className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-white transition-colors">
            <ExternalLink size={14} />
          </a>
        </Tooltip>
        <Tooltip label="Delete" side="bottom">
          <button onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); onRemove(entry.id); }} aria-label={`Delete ${entry.finalUrl}`} className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
