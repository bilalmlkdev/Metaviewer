"use client";

import { useHistoryAll } from "@/hooks/useHistory";
import { EmptyHistory } from "@/components/ui";
import { HistoryCard } from "@/components/HistoryCard";
import { SiteHeader } from "@/components/SiteHeader";
import { Tooltip } from "@/components/Tooltip";
import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const { entries, loaded, remove, clearAll } = useHistoryAll();

  if (!loaded) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Tooltip label="Go back">
              <Link href="/" className="text-muted hover:text-fg" aria-label="Go back to homepage">
                <ArrowLeft size={18} />
              </Link>
            </Tooltip>
            <h1 className="text-xl font-medium">History</h1>
          </div>
          {entries.length > 0 && (
            <button
              onClick={() => { if (confirm("Clear all history? This cannot be undone.")) clearAll(); }}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>

        {entries.length === 0 && <EmptyHistory />}

        <div className="flex flex-col gap-5">
          {entries.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} onRemove={remove} />
          ))}
        </div>
      </main>
    </div>
  );
}
