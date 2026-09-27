import { Github, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Tooltip } from "@/components/Tooltip";

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full max-w-[1100px] mx-auto border-t border-border/60 px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Logo className="h-[24px] w-[24px] text-accent relative bottom-[1px]" />
            <span className="font-instrument-serif text-lg sm:text-xl md:text-2xl">Metaviewer</span>
          </div>
          <p className="text-sm text-muted max-w-xs">
            See what matters in your website, with clear, actionable insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Tooltip label="GitHub">
            <a href="https://github.com/bilalmlkdev" target="_blank" rel="noreferrer" aria-label="GitHub" className="h-9 w-9 flex items-center justify-center rounded-lg border border-border shadow-xs text-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors">
              <Github size={16} />
            </a>
          </Tooltip>
          <Tooltip label="Twitter">
            <a href="https://twitter.com/bilalmlkdev" target="_blank" rel="noreferrer" aria-label="Twitter" className="h-9 w-9 flex items-center justify-center rounded-lg border border-border shadow-xs text-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors">
              <Twitter size={16} />
            </a>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center justify-center overflow-hidden pointer-events-none select-none leading-[1]" style={{ WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)", maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)" }}>
        <span className="text-[80px] sm:text-[120px] md:text-[200px] font-bold tracking-[-18px] text-fg/[0.04]">
          Metaviewer
        </span>
      </div>
      <p className="text-xs text-muted mt-6">
        © {new Date().getFullYear()} Metaviewer. All rights reserved.
      </p>
    </footer>
  );
}
