"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Github, Star } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";
import { Logo } from "@/components/Logo";
import { useStarCount } from "@/hooks/useStarCount";
import { ThemeToggle } from "@/components/ThemeToggle";

const SHRINK_AFTER = 24;

export function SiteHeader() {
  const [shrunk, setShrunk] = useState(false);
  const { count, loaded } = useStarCount();

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > SHRINK_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayCount = loaded
    ? count !== null && count >= 10 ? count : "129"
    : "…";

  return (
    <>
      <header className={clsx("fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out", shrunk ? "pt-2" : "pt-2")}>
        <div className={clsx("mx-auto flex h-[70px] w-full items-center justify-between px-4 sm:px-6 border-border/60 bg-background/70 backdrop-blur-xl transition-all duration-300 ease-out border", shrunk ? "max-w-[880px] rounded-2xl" : "max-w-[1152px] rounded-2xl")}>
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1.5" aria-label="Metaviewer home">
              <Logo className="h-[24px] w-[24px] text-accent relative bottom-[1px]" />
              <span className="font-instrument-serif text-lg sm:text-xl md:text-2xl tracking-normal">Metaviewer</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip label="Toggle theme"><ThemeToggle /></Tooltip>
            <Tooltip label="Star on GitHub">
              <a href="https://github.com/bilalmlkdev/Metaviewer" target="_blank" rel="noreferrer" aria-label="GitHub" className="h-9 flex items-center gap-2 pl-3 pr-2 rounded-lg border border-border bg-surface shadow-xs text-sm text-fg hover:bg-fg/10 transition-colors">
                <Github size={15} />
                <span className="hidden sm:inline">Stars</span>
                  <span className="hidden sm:flex items-center gap-1 pl-2 ml-1 border-l border-border text-xs text-yellow-400">
                  <Star size={12} fill="#facc15" color="#facc15" />
                  {displayCount}
                </span>
              </a>
            </Tooltip>
          </div>
        </div>
      </header>
      <div aria-hidden className={clsx("h-[76px] shrink-0 transition-[height]", shrunk && "h-[68px]")} />
    </>
  );
}
