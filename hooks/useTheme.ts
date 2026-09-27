"use client";

import { useEffect, useState, useCallback } from "react";
import { getStoredTheme, setStoredTheme } from "@/lib/localHistory";

export function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setThemeState(current);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    setStoredTheme(next);
  }, [theme]);

  return { theme, toggle, mounted };
}
