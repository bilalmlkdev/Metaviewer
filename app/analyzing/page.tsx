"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Globe,
  ScanSearch,
  ListChecks,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { saveResult, getResult } from "@/lib/localHistory";
import { Logo } from "@/components/Logo";

const STEPS = [
  { icon: Globe, label: "Fetching the page" },
  { icon: ScanSearch, label: "Parsing meta tags" },
  { icon: ListChecks, label: "Scoring & building previews" },
];

const STEP_DURATION = 700;

function AnalyzingScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const url = params.get("url") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const apiCalled = useRef(false);

  useEffect(() => {
    if (!url) {
      router.replace("/");
      return;
    }

    const startTime = Date.now();
    let stepIndex = 0;
    let apiDone = false;
    let stepsDone = false;
    let cancelled = false;
    let resultId: string | null = null;

    const elapsedTimer = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);

    const stepTimer = setInterval(() => {
      if (stepIndex < STEPS.length - 1) {
        stepIndex += 1;
        setStep(stepIndex);
      }
    }, STEP_DURATION);

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 3 : p));
    }, 80);

    function tryRedirect() {
      if (cancelled || !apiDone || !stepsDone || !resultId) return;
      clearInterval(elapsedTimer);
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      setProgress(100);
      setElapsed(Date.now() - startTime);
      setTimeout(() => {
        if (!cancelled) router.replace(`/results/${resultId}`);
      }, 400);
    }

    const finishSteps = setTimeout(() => {
      clearInterval(stepTimer);
      setStep(STEPS.length - 1);
      setAllDone(true);
      stepsDone = true;
      tryRedirect();
    }, STEP_DURATION * STEPS.length);

    if (!apiCalled.current) {
      apiCalled.current = true;
      (async () => {
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
          const data = await res.json();
          if (cancelled) return;
          if (!res.ok) {
            clearInterval(elapsedTimer);
            clearInterval(stepTimer);
            clearInterval(progressTimer);
            clearTimeout(finishSteps);
            setError(data.error ?? "Something went wrong.");
            return;
          }
          saveResult(data);
          const saved = getResult(data.id);
          if (!saved) {
            clearInterval(elapsedTimer);
            clearInterval(stepTimer);
            clearInterval(progressTimer);
            clearTimeout(finishSteps);
            setError("Failed to save result. Please try again.");
            return;
          }
          apiDone = true;
          resultId = data.id;
          tryRedirect();
        } catch {
          if (cancelled) return;
          clearInterval(elapsedTimer);
          clearInterval(stepTimer);
          clearInterval(progressTimer);
          clearTimeout(finishSteps);
          setError("Network error. Please try again.");
        }
      })();
    }

    return () => {
      cancelled = true;
      clearInterval(elapsedTimer);
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      clearTimeout(finishSteps);
    };
  }, [url, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-6">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle size={24} />
        </span>
        <div>
          <p className="text-lg text-fg mb-1">Analysis failed</p>
          <p className="text-sm text-muted max-w-sm">{error}</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="h-10 px-5 rounded-lg border border-border bg-surface shadow-xs text-sm text-fg hover:bg-fg/5 transition-colors"
        >
          Back to homepage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 text-center px-6">
      <Logo className="h-10 w-10 text-accent opacity-80" />

      <div className="w-full max-w-sm">
        <p className="text-lg text-fg mb-1">
          Analyzing{" "}
          <span className="text-accent font-mono text-base">
            {url.replace(/^https?:\/\//, "")}
          </span>
        </p>
        <p className="text-sm text-muted flex items-center justify-center gap-2">
          Fetching, parsing, and scoring this page.
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted/60 tabular-nums">
            <Clock size={11} />
            {(elapsed / 1000).toFixed(1)}s
          </span>
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {STEPS.map((s, i) => {
          const done = i < step || (allDone && i <= step);
          const active = i === step && !allDone;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                done || active ? "text-fg" : "text-muted/40"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  done
                    ? "bg-accent border-accent text-black scale-100"
                    : active
                      ? "border-accent text-accent animate-pulse"
                      : "border-border text-muted/40"
                }`}
              >
                {done ? <CheckCircle2 size={15} /> : <s.icon size={14} />}
              </span>
              <span className={active ? "text-fg" : ""}>{s.label}</span>
              {active && (
                <span className="ml-auto flex gap-0.5">
                  <span className="h-1 w-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1 w-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1 w-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AnalyzingScreen />
    </Suspense>
  );
}
