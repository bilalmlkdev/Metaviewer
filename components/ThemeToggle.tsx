"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();

  if (!mounted) {
    return <span className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-surface shadow-xs" />;
  }

  return (
    <button aria-label="Toggle theme" onClick={toggle} className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-surface shadow-xs text-muted hover:text-fg transition-colors">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
