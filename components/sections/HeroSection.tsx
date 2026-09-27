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
          <span className="text-fg/30">See How Your </span>
          <span className="relative inline-block text-fg">
            Link
            <svg aria-hidden className="absolute -bottom-1 left-0 w-full h-3 overflow-visible" viewBox="0 0 60 12" fill="none" preserveAspectRatio="none">
              <path d="M3 7 C 12 3, 22 3, 30 7 C 38 11, 48 11, 57 6" stroke="var(--color-accent)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </svg>
          </span>
          <span className="text-fg/30"> Looks</span>
          <br />
          <span className="text-fg/30">Everywhere, </span>
          <span className="relative inline-block text-fg">
            Instantly
            <svg aria-hidden className="absolute -bottom-1 left-0 w-full h-3 overflow-visible" viewBox="0 0 140 12" fill="none" preserveAspectRatio="none">
              <path d="M3 7 C 25 3, 48 3, 70 7 C 92 11, 115 11, 137 6" stroke="var(--color-accent)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-muted text-base sm:text-lg leading-relaxed mt-7 max-w-xl mx-auto">
          Paste any URL and get an instant preview of how it renders across
          every major platform - with a score, real image dimensions, and
          copy-paste fixes for anything that&apos;s broken.
        </p>

        <div id="analyze" className="mt-10 w-full flex justify-center scroll-mt-24">
          <AnalyzeForm />
        </div>
      </div>
    </section>
  );
}
