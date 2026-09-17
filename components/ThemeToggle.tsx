"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getStoredTheme, setStoredTheme } from "@/lib/localHistory";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    setStoredTheme(next);
  }

  if (!mounted) {
    return (
      <span className="h-9 w-9 flex items-center justify-center rounded-md border border-border" />
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg transition-colors"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
