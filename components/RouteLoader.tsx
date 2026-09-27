"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyRef = useRef(true);

  const startLoading = useCallback(() => {
    if (!readyRef.current) return;
    readyRef.current = false;
    setLoading(true);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((p) => (p < 100 ? p + Math.random() * 12 : 100));
    }, 80);
  }, []);

  useEffect(() => {
    const handlePop = () => startLoading();

    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      startLoading();
      return origPush.apply(this, args);
    };
    window.history.replaceState = function (...args) {
      startLoading();
      return origReplace.apply(this, args);
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]");
      if (anchor && !(anchor as HTMLAnchorElement).target?.includes("_blank")) {
        startLoading();
      }
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePop);

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("popstate", handlePop);
      document.removeEventListener("click", handleClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startLoading]);

  useEffect(() => {
    if (!loading || progress < 95) return;
    if (timerRef.current) clearInterval(timerRef.current);
    hideRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
      readyRef.current = true;
    }, 250);
    return () => {
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [loading, progress]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-accent rounded-r-full"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1, transition: "width 80ms linear, opacity 300ms ease" }}
      />
    </div>
  );
}
