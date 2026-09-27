import Link from "next/link";
import { Home } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Page not found - Metaviewer",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface text-accent mb-6">
          <Logo className="h-10 w-10" />
        </span>

        <p className="text-xs font-mono text-muted tracking-wide mb-3">
          ERROR 404
        </p>

        <h1 className="font-sans text-3xl sm:text-5xl tracking-tight max-w-xl">
          This page went missing
        </h1>

        <p className="text-sm text-muted leading-relaxed mt-4 max-w-sm">
          We could not find the page you are looking for. It may have been
          moved, renamed, or never existed.
        </p>

        <Link
          href="/"
          className="mt-9 h-10 inline-flex items-center gap-2 px-5 rounded-lg bg-accent text-background text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent/60"
        >
          <Home size={16} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
