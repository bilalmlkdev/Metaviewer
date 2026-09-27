"use client";

import { AlertCircle, RefreshCw, Globe, ShieldAlert, Zap, WifiOff, Home } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface AnalyzeErrorProps {
  error: string;
  url: string;
}

function getErrorDetail(msg: string): {
  icon: React.ElementType;
  title: string;
  description: string;
  suggestion: string;
} {
  const lower = msg.toLowerCase();

  if (lower.includes("too many requests")) {
    return {
      icon: Zap,
      title: "Rate limit exceeded",
      description: "You have made too many requests in a short time.",
      suggestion: "Wait a moment and try again.",
    };
  }

  if (lower.includes("local or private network")) {
    return {
      icon: ShieldAlert,
      title: "Private network not allowed",
      description: "This URL points to a local or private network address.",
      suggestion: "Use a publicly reachable URL instead.",
    };
  }

  if (lower.includes("couldn't reach") || lower.includes("can't reach")) {
    return {
      icon: WifiOff,
      title: "Could not reach this URL",
      description: "The site may be down, blocked, or not responding.",
      suggestion: "Check the URL and make sure the site is accessible from your location.",
    };
  }

  if (lower.includes("http")) {
    return {
      icon: Globe,
      title: "Site returned an error",
      description: `The server responded with an HTTP error.`,
      suggestion: "The site may be temporarily unavailable. Try again later.",
    };
  }

  if (lower.includes("empty response")) {
    return {
      icon: Globe,
      title: "Empty response",
      description: "The server returned no content.",
      suggestion: "This may be a configuration issue on the site's end.",
    };
  }

  if (lower.includes("exceeds") || lower.includes("10 mb")) {
    return {
      icon: Zap,
      title: "Page too large",
      description: "The response body exceeds the 10 MB limit.",
      suggestion: "Try a smaller page or a different URL.",
    };
  }

  if (lower.includes("failed to save")) {
    return {
      icon: ShieldAlert,
      title: "Failed to save result",
      description: "The analysis completed but could not be saved.",
      suggestion: "Try again — your browser storage may be full or temporarily unavailable.",
    };
  }

  if (lower.includes("network")) {
    return {
      icon: WifiOff,
      title: "Network error",
      description: "A network issue occurred while communicating with the server.",
      suggestion: "Check your internet connection and try again.",
    };
  }

  return {
    icon: AlertCircle,
    title: "Analysis failed",
    description: msg || "An unexpected error occurred.",
    suggestion: "Try again with a different URL or check back later.",
  };
}

export default function AnalyzeErrorPage({ error, url }: AnalyzeErrorProps) {
  const detail = getErrorDetail(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <span className="inline-flex h-20 w-20 items-center justify-center text-accent mb-2">
        <Logo className="h-10 w-10" />
      </span>

      <div>
        <p className="text-xs font-mono text-muted tracking-wide mb-2">
          ANALYSIS FAILED
        </p>
        <h1 className="font-sans text-2xl sm:text-3xl tracking-tight max-w-md">
          {detail.title}
        </h1>
      </div>

      <p className="text-sm text-muted leading-relaxed max-w-sm">
        {detail.description}
      </p>

      <div className="rounded-xl border border-border bg-surface/60 p-4 max-w-sm w-full text-left">
        <p className="text-xs font-mono text-muted mb-1">What happened</p>
        <p className="text-sm text-fg/80">{detail.description}</p>
        <p className="text-xs font-mono text-muted mt-3 mb-1">Suggestion</p>
        <p className="text-sm text-fg/80">{detail.suggestion}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => window.location.reload()}
          className="h-10 px-5 rounded-lg bg-accent text-background text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent/60"
        >
          <RefreshCw size={16} />
          Try again
        </button>
        <Link
          href="/"
          className="h-10 px-5 rounded-lg border border-border bg-surface text-sm font-medium text-fg hover:bg-fg/5 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent/60"
        >
          <Home size={16} />
          Homepage
        </Link>
      </div>
    </div>
  );
}
