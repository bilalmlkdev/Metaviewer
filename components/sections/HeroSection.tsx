import { Github } from "lucide-react";
import { AnalyzeForm } from "@/components/AnalyzeForm";

export function HeroSection() {
  return (
    <section className="px-6 pt-10 pb-16">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 mb-4">
          <Github size={14} className="text-muted" />
          <span className="text-xs font-mono text-muted">
            Proudly Open Source Software!
          </span>
        </div>

        <h1 className="font-instrument-serif text-[2.5rem] sm:text-[4.5rem] md:text-[5.5rem] leading-[1.05] tracking-tight text-balance">
          <span className="text-fg/30">Understand </span>
          <span className="text-fg">Any</span>
          <span className="text-fg/30"> Link</span>
          <br />
          <span className="relative inline-block text-fg">
            In Seconds
            <svg aria-hidden className="absolute -bottom-1 left-0 w-full h-3 overflow-visible" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
              <path d="M3 7 C 30 3, 55 3, 80 7 C 105 11, 130 11, 155 7 C 170 4.5, 185 4.5, 197 6" stroke="rgb(var(--color-accent))" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <span className="text-fg/30">, Not in Hours.</span>
        </h1>

        <p className="text-muted text-base sm:text-lg leading-relaxed mt-7 max-w-xl mx-auto">
          Paste any URL and see the preview card it actually produces,
          then fix what&apos;s cropped, missing, or wrong before someone
          else sees it first.
        </p>

        <div id="analyze" className="mt-10 w-full flex justify-center scroll-mt-24">
          <AnalyzeForm />
        </div>
      </div>
    </section>
  );
}
