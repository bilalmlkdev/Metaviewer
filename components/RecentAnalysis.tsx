"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Clock,
  Globe,
  Info,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  getHistory,
  clearHistory,
  type HistoryEntry,
} from "@/lib/localHistory";
import { timeAgo } from "@/lib/timeAgo";

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (grade.startsWith("B")) return "text-lime-400 bg-lime-500/10 border-lime-500/20";
  if (grade.startsWith("C")) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (grade.startsWith("D")) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  return "text-red-400 bg-red-500/10 border-red-500/20";
}

function parseUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/**
 * Site icon shown on each card: the analyzed site's own favicon first, then a
 * public icon service, then a plain globe so a dead link never breaks the card.
 */
function SiteFavicon({ entry }: { entry: HistoryEntry }) {
  const [stage, setStage] = useState(0);
  const parsed = parseUrl(entry.finalUrl) ?? parseUrl(entry.url);
  const host = parsed?.hostname ?? "";

  const candidates = [
    entry.favicon,
    host
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`
      : "",
  ].filter(Boolean) as string[];

  const src = candidates[stage];

  return (
    <span className="shrink-0 h-9 w-9 flex items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
      {src ? (
        // Icon URLs are arbitrary third-party hosts, so next/image can't
        // optimize them without a per-host allowlist in next.config.mjs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          onError={() => setStage((s) => s + 1)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <Globe size={15} className="text-muted" />
      )}
    </span>
  );
}

function siteInfo(entry: HistoryEntry) {
  const parsed = parseUrl(entry.finalUrl) ?? parseUrl(entry.url);
  const name = parsed?.hostname ?? entry.finalUrl.replace(/^https?:\/\//, "");
  const path = parsed ? parsed.pathname.replace(/\/+$/, "") || "/" : "";
  return { name, path };
}

export function RecentAnalysis() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistory().slice(0, 6));
    setLoaded(true);
  }, []);

  // Nothing saved yet in this browser - don't show an empty section on a
  // fresh visit or in server-rendered markup.
  if (!loaded || entries.length === 0) return null;

  return (
    <section className="px-6 pb-16 rise-in">
      <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted">
              <Clock size={16} />
            </span>
            <h2 className="font-medium text-base sm:text-lg truncate">
              Recently Analyzed
            </h2>
            <span className="shrink-0 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border bg-background px-2 text-xs text-muted tabular-nums">
              {entries.length}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/history"
              className="text-sm text-accent hover:underline"
            >
              View all
            </Link>
            <button
              onClick={() => {
                if (!confirm("Clear all history? This cannot be undone.")) return;
                clearHistory();
                setEntries([]);
              }}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-border/70 bg-background px-4 py-3 text-xs text-muted">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>
            Saved in this browser only — nothing is uploaded.{" "}
            <span className="text-fg font-medium">Nothing expires</span> until
            you clear it.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry, i) => {
            const { name, path } = siteInfo(entry);

            return (
              <Link
                key={entry.id}
                href={`/results/${entry.id}`}
                className="group flex flex-col rounded-xl border border-border bg-background p-4 transition-colors hover:border-accent/40 rise-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SiteFavicon entry={entry} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-muted truncate">{path}</p>
                  </div>
                  <ExternalLink
                    size={13}
                    className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3.5">
                  <span
                    className={clsx(
                      "inline-flex items-baseline gap-1 rounded-md border px-2 py-0.5 font-medium",
                      gradeColor(entry.grade)
                    )}
                  >
                    <span className="text-sm tabular-nums">{entry.score}</span>
                    <span className="text-[11px]">{entry.grade}</span>
                  </span>
                  <span className="flex items-center gap-2.5 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 size={11} /> {entry.passCount}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <AlertTriangle size={11} /> {entry.warningCount}
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle size={11} /> {entry.errorCount}
                    </span>
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted">
                  {timeAgo(entry.fetchedAt)}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
