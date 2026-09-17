"use client";

import { Eye, FileText, Share2, Twitter, ImageIcon, Code2, Trophy } from "lucide-react";

export type TabId = "previews" | "basic" | "opengraph" | "twitter" | "images" | "raw" | "score";

export const RESULT_TABS: { id: TabId; label: string; icon: typeof Eye }[] = [
  { id: "previews", label: "Previews", icon: Eye },
  { id: "basic", label: "Basic", icon: FileText },
  { id: "opengraph", label: "Open Graph", icon: Share2 },
  { id: "twitter", label: "X / Twitter", icon: Twitter },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "raw", label: "Raw", icon: Code2 },
  { id: "score", label: "Score", icon: Trophy },
];

export function ResultTabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <div
      role="tablist"
      className="relative flex items-center justify-between gap-1 mb-5 flex-wrap rounded-[8px] border border-border bg-surface px-0.5 overflow-x-auto hide-scrollbar"
    >
      {RESULT_TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center justify-center gap-2.5 w-[130px] h-11 rounded-[5px] text-sm whitespace-nowrap transition-colors duration-300 ${
              isActive ? "text-background bg-fg" : "text-muted hover:text-fg"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
