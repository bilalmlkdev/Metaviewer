"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResult, saveResult } from "@/lib/localHistory";
import type { AnalysisResult } from "@/types";

export function useResult() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current); };
  }, []);

  useEffect(() => {
    const cached = getResult(params.id);
    if (cached) {
      setResult(cached);
    } else {
      setError("We couldn't find this result in your browser's history. It may have been cleared, or opened on a different device.");
    }
  }, [params.id]);

  const reanalyze = useCallback(async () => {
    if (!result) return;
    setReanalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.finalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Re-analysis failed.");
      saveResult(data);
      router.replace(`/results/${data.id}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Re-analysis failed.");
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setError(null), 3000);
    } finally {
      setReanalyzing(false);
    }
  }, [result, router]);

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, []);

  const goBack = useCallback(() => router.push("/"), [router]);

  const goHistory = useCallback(() => router.push("/history"), [router]);

  return { result, error, reanalyzing, copied, reanalyze, share, goBack, goHistory };
}
