"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Link2, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { isValidUrl } from "@/lib/url";

const EXAMPLES = ["stripe.com", "vercel.com", "linear.app", "bilalmlkdev.vercel.app"];

export function AnalyzeForm() {
  const [url, setUrl] = useState("");
  const [navigating, setNavigating] = useState(false);
  const [touched, setTouched] = useState(false);
  const router = useRouter();

  const valid = isValidUrl(url);
  const showError = touched && url.trim() !== "" && !valid;

  function submit(value: string) {
    const target = value.trim();
    if (!isValidUrl(target) || navigating) return;
    setNavigating(true);
    router.push(`/analyzing?url=${encodeURIComponent(target)}`);
  }

  return (
    <div className="flex flex-col items-center w-full min-w-0">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(url);
        }}
        className="w-full max-w-2xl min-w-0"
      >
        <div
          className={`flex items-center gap-2 rounded-xl border bg-surface/60 p-2 backdrop-blur-sm transition-colors ${
            showError ? "border-red-500/50" : "border-border focus-within:border-accent/50"
          }`}
        >
          <label htmlFor="analyze-url" className="sr-only">
            URL to analyze
          </label>

          <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-lg border border-border bg-fg/5">
            <Link2 size={15} className="text-muted" />
          </div>

          <input
            id="analyze-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Enter any URL (e.g. stripe.com)"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 min-w-0 h-10 bg-fg/5 rounded-lg pr-2 pl-3 text-sm font-mono placeholder:text-muted/60 focus:outline-none"
          />

          <button
            type="submit"
            disabled={navigating || !valid}
            className="h-10 shrink-0 px-5 rounded-lg bg-accent/70 text-black font-medium text-sm flex items-center gap-2 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {navigating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <Search size={14} />
                Analyze
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>

        {showError && (
          <p className="flex items-center gap-1.5 mt-2.5 text-xs text-red-400 px-1">
            <AlertCircle size={13} className="shrink-0" />
            Enter a valid URL or domain (e.g. stripe.com or https://stripe.com)
          </p>
        )}
      </form>

      <p className="mt-5 text-xs font-mono text-muted/70 text-center">
        Enter a URL to analyze (e.g.,{" "}
        {EXAMPLES.map((ex, i) => (
          <span key={ex}>
            <button
              onClick={() => submit(ex)}
              aria-label={`Analyze ${ex}`}
              className="text-muted underline underline-offset-2 hover:text-fg transition-colors"
              type="button"
              disabled={navigating}
            >
              {ex}
            </button>
            {i < EXAMPLES.length - 1 && ", "}
          </span>
        ))}
        {")"}
      </p>
    </div>
  );
}
