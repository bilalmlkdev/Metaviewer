import Link from "next/link";
import { CompassIcon, Home } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Page not found - Metaviewer",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface text-accent mb-6">
          <CompassIcon size={24} />
        </span>

        <p className="text-xs font-mono text-muted tracking-wide mb-3">
          ERROR 404
        </p>

        <h1 className="font-sans text-3xl sm:text-5xl leading-tightest tracking-tight max-w-xl">
          This page went missing
        </h1>

        <p className="text-sm text-muted leading-relaxed mt-4 max-w-sm">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, renamed, or never existed.
        </p>

        <Link
          href="/"
          className="mt-9 h-10 inline-flex items-center gap-2 px-4 rounded-md border border-border bg-surface text-sm font-medium text-fg hover:bg-fg/5 focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors"
        >
          <Home size={16} />
          Back to home
        </Link>
      </section>
    </div>
  );
}
