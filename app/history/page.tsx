"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Tooltip } from "@/components/Tooltip";
import { Logo } from "@/components/Logo";
import {
  getHistory,
  removeFromHistory,
  clearHistory,
  type HistoryEntry,
} from "@/lib/localHistory";

function gradeColor(grade: string) {
  if (grade === "A") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (grade === "B") return "text-lime-400 bg-lime-500/10 border-lime-500/20";
  if (grade === "C") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (grade === "D") return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  return "text-red-400 bg-red-500/10 border-red-500/20";
}

function gradeBg(grade: string) {
  if (grade === "A") return "bg-emerald-500";
  if (grade === "B") return "bg-lime-500";
  if (grade === "C") return "bg-amber-500";
  if (grade === "D") return "bg-orange-500";
  return "bg-red-500";
}

function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setLoaded(true);
  }, []);

  function handleRemove(id: string) {
    removeFromHistory(id);
    setEntries((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Tooltip label="Go back">
              <Link
                href="/"
                className="text-muted hover:text-fg"
                aria-label="Go back to homepage"
              >
                <ArrowLeft size={18} />
              </Link>
            </Tooltip>
            <h1 className="text-xl font-medium">History</h1>
          </div>
          {entries.length > 0 && (
            <button
              onClick={() => {
                if (!confirm("Clear all history? This cannot be undone."))
                  return;
                clearHistory();
                setEntries([]);
              }}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>

        {loaded && entries.length === 0 && (
          <div className="text-center py-24 text-muted">
            <Logo className="h-12 w-12 mx-auto mb-5 text-border" />
            <p className="mb-4">
              No checks yet. Everything you analyze is saved here, in your
              browser only.
            </p>
            <Link
              href="/"
              className="text-accent hover:underline text-sm"
            >
              Run your first check
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {entries.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group relative rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/40 transition-colors"
              >
                <Link
                  href={`/results/${e.id}`}
                  className="block"
                >
                  {/* og:image top half */}
                  <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-background">
                    {isValidHttpUrl(e.ogImage) ? (
                      <Image
                        src={e.ogImage!}
                        alt={e.title ?? "Preview"}
                        fill
                        sizes="(max-width: 768px) 100vw, 672px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-grid">
                        <Logo className="h-16 w-16 text-border" />
                      </div>
                    )}
                   
                    {/* time badge overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-sm px-2 py-1 text-[11px] font-mono text-white/80">
                        <Clock size={11} />
                        {new Date(e.fetchedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {typeof e.loadTimeMs === "number" && (
                          <> · {(e.loadTimeMs / 1000).toFixed(1)}s</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* details bottom half */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      {/* favicon / logo left */}
                      <div className="shrink-0 mt-0.5">
                        {isValidHttpUrl(e.favicon) ? (
                          <Image
                            src={e.favicon!}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-md border border-border bg-background"
                            unoptimized
                          />
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background">
                            <Logo className="h-4 w-4 text-muted" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-fg truncate">
                          {e.title ?? e.finalUrl.replace(/^https?:\/\//, "")}
                        </h3>
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">
                          {e.description ??
                            `Analyzed ${e.finalUrl.replace(/^https?:\/\//, "")}`}
                        </p>
                      </div>

                      <span className="shrink-0 text-lg font-bold tabular-nums text-fg">
                        {e.score}
                      </span>
                    </div>

                    {/* stats row */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/60 text-xs text-muted">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 size={13} /> {e.passCount}
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <AlertTriangle size={13} /> {e.warningCount}
                      </span>
                      <span className="flex items-center gap-1.5 text-red-400">
                        <XCircle size={13} /> {e.errorCount}
                      </span>
                      <span className="ml-auto font-mono text-muted/60 truncate max-w-[180px]">
                        {e.finalUrl.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* action buttons */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip label="Open site" side="bottom">
                    <a
                      href={e.finalUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${e.finalUrl} in new tab`}
                      onClick={(ev) => ev.stopPropagation()}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </Tooltip>
                  <Tooltip label="Delete" side="bottom">
                    <button
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        handleRemove(e.id);
                      }}
                      aria-label={`Delete ${e.finalUrl}`}
                      className="h-8 w-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
