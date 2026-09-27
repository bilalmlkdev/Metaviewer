"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import Image from "next/image";
import { Logo } from "./Logo";
import type { HistoryEntry } from "@/lib/localHistory";

export function SiteIcon({ entry }: { entry: HistoryEntry }) {
  const [stage, setStage] = useState(0);
  const parsed = entry.finalUrl.startsWith("http") ? new URL(entry.finalUrl) : null;
  const host = parsed?.hostname ?? "";
  const candidates = [
    entry.favicon,
    host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64` : "",
  ].filter(Boolean) as string[];
  const src = candidates[stage];

  return (
    <span className="shrink-0 h-8 w-8 flex items-center justify-center overflow-hidden rounded-md border border-border bg-background">
      {src ? (
        <img
          key={src}
          src={src}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          onError={() => setStage((s) => s + 1)}
          className="h-full w-full object-contain"
        />
      ) : (
        <Globe size={13} className="text-muted" />
      )}
    </span>
  );
}
