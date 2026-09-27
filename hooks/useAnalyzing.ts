"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveResult, getResult } from "@/lib/localHistory";
import type { AnalysisResult } from "@/types";

const STEPS = [
  { label: "Fetching the page" },
  { label: "Parsing meta tags" },
  { label: "Scoring & building previews" },
];

export function useAnalyzing() {
  const router = useRouter();
  const params = useSearchParams();
  const url = params.get("url") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const abortCtrl = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(() => {
    if (!url) { router.replace("/"); return; }

    const startTime = Date.now();
    let stepIndex = 0;
    const cancelled = { value: false };

    const elapsedTimer = setInterval(() => setElapsed(Date.now() - startTime), 100);

    // Advance steps slowly while waiting - each step takes ~2s
    const stepTimer = setInterval(() => {
      if (stepIndex < STEPS.length - 1) { stepIndex += 1; setStep(stepIndex); }
    }, 2000);

    // Progress bar creeps toward 90% while waiting
    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 3 : p));
    }, 80);

    if (abortCtrl.current) abortCtrl.current.abort();
    const ctrl = new AbortController();
    abortCtrl.current = ctrl;

    function cleanup() {
      clearInterval(elapsedTimer);
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    }

    (async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: ctrl.signal,
        });
        if (ctrl.signal.aborted) { cleanup(); return; }
        const data = await res.json();
        if (!res.ok) {
          cleanup();
          setError(data.error ?? "Something went wrong.");
          return;
        }
        saveResult(data);
        const saved = getResult(data.id);
        if (!saved) {
          cleanup();
          setError("Failed to save result. Please try again.");
          return;
        }

        // API done - complete everything instantly and redirect
        cleanup();
        setStep(STEPS.length - 1);
        setAllDone(true);
        setProgress(100);
        setElapsed(Date.now() - startTime);

        setTimeout(() => {
          if (!cancelled.value) router.replace(`/results/${data.id}`);
        }, 350);
      } catch {
        if (ctrl.signal.aborted) { cleanup(); return; }
        cleanup();
        setError("Network error. Please try again.");
      }
    })();

    return () => {
      cancelled.value = true;
      ctrl.abort();
      cleanup();
    };
  }, [url, router]);

  useEffect(() => { runAnalysis(); }, [runAnalysis]);

  return { error, step, allDone, progress, elapsed, url };
}
