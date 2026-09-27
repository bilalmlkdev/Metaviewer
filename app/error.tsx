"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 mb-6">
          <Logo className="h-10 w-10" />
        </span>

        <p className="text-xs font-mono text-muted tracking-wide mb-3">
          SOMETHING WENT WRONG
        </p>

        <h1 className="font-sans text-3xl sm:text-5xl tracking-tight max-w-xl">
          Unexpected error
        </h1>

        <p className="text-sm text-muted leading-relaxed mt-4 max-w-sm">
          Metaviewer hit a problem while processing this request. You can try
          again, or head back home.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-muted/60 mt-3">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-9 flex items-center gap-3">
          <button
            onClick={() => reset()}
            className="h-10 inline-flex items-center gap-2 px-5 rounded-lg bg-accent text-background text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent/60"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="h-10 inline-flex items-center gap-2 px-5 rounded-lg border border-border bg-surface text-sm font-medium text-fg hover:bg-fg/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/60"
          >
            <Home size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
