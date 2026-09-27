"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { TimeAgo } from "@/components/ui/TimeAgo";
import { SiteIcon } from "@/components/SiteIcon";
import { Logo } from "@/components/Logo";
import { Tooltip } from "@/components/Tooltip";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function RecentAnalysis() {
  const { entries } = useHistory();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded || entries.length === 0) return null;

  return (
    <section className="px-6 pb-20">
      <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted">
              <Clock size={16} />
            </span>
            <h2 className="font-medium text-base sm:text-lg truncate">Recently Analyzed</h2>
            <span className="shrink-0 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border bg-background px-2 text-xs text-muted tabular-nums">
              {entries.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {entries.map((entry, i) => {
            const name = entry.finalUrl.replace(/^https?:\/\//, "");
            const ogImg = entry.ogImage;

            return (
              <Tooltip key={entry.id} label={name} className="w-full h-full">
                <Link
                  href={`/results/${entry.id}`}
                  className="group flex flex-col w-full h-full min-h-[260px] rounded-xl border border-border bg-background/60 p-3 sm:p-4 transition-all hover:border-accent/30 rise-in overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative h-32 shrink-0 rounded-lg overflow-hidden bg-grid mb-2">
                    {ogImg ? (
                      <Image src={ogImg} alt="" fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover group-hover:scale-[1.02] transition-transform duration-300" unoptimized style={{ objectPosition: "top center" }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50"><Logo className="h-8 w-8 text-border" /></div>
                    )}
                    <GradeBadge grade={entry.grade as any} />
                  </div>

                  <div className="flex-1 min-h-0 min-w-0 flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <SiteIcon entry={entry} />
                      <span className="text-sm font-medium truncate">{name}</span>
                      <ExternalLink size={12} className="shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted truncate mb-2">{name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={11} /> {entry.passCount}</span>
                      <span className="flex items-center gap-1 text-amber-400"><AlertTriangle size={11} /> {entry.warningCount}</span>
                      <span className="flex items-center gap-1 text-red-400"><XCircle size={11} /> {entry.errorCount}</span>
                      <span className="ml-auto font-mono text-muted/50 tabular-nums">
                        {entry.loadTimeMs !== undefined && entry.loadTimeMs > 0 ? `${(entry.loadTimeMs / 1000).toFixed(1)}s` : ""}
                      </span>
                    </div>
                    <div className="mt-auto pt-1.5 text-[10px] text-muted/40 tabular-nums"><TimeAgo date={entry.fetchedAt} /></div>
                  </div>
                </Link>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border/60">
          <Link href="/history" className="block text-center text-sm text-muted hover:text-accent transition-colors">
            You have {entries.length} recent analysis{entries.length !== 1 ? "es" : ""} saved locally - view your full history with scores, timestamps, and trends →
          </Link>
        </div>
      </div>
    </section>
  );
}
