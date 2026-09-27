"use client";

import { useEffect, useState, useRef } from "react";

const GITHUB_REPO = "bilalmlkdev/Metaviewer";

export function useStarCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
        if (cancelled.current) return;
        const data = await res.json();
        setCount(data.stargazers_count ?? 0);
      } catch {
        if (!cancelled.current) setCount(null);
      } finally {
        if (!cancelled.current) setLoaded(true);
      }
    })();
    return () => { cancelled.current = true; };
  }, []);

  return { count, loaded };
}
