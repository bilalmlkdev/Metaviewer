"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
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
      <SiteHeader />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 mb-6">
         <Logo />
        </span>

        <p className="text-xs font-mono text-muted tracking-wide mb-3">
          SOMETHING BROKE
        </p>

        <h1 className="font-sans text-3xl sm:text-5xl leading-tightest tracking-tight max-w-xl">
          Unexpected error
        </h1>

        <p className="text-sm text-muted leading-relaxed mt-4 max-w-sm">
          Metaviewer ran into a problem loading this page. You can try again,
          or head back home.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-muted/70 mt-3">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-9 flex items-center gap-3">
          <button
            onClick={() => reset()}
            className="h-10 inline-flex items-center gap-2 px-4 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="h-10 inline-flex items-center gap-2 px-4 rounded-md border border-border bg-surface text-sm font-medium text-fg hover:bg-fg/5 focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors"
          >
            <Home size={16} />
            Home
          </Link>
        </div>
      </section>
    </div>
  );
}
