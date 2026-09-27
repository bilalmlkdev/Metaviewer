"use client";

import {
  Eye,
  Target,
  Wand2,
  ImageIcon,
  FileJson,
  Share2,
  Download,
  Zap,
  History,
  Github,
  Twitter,
  Link2,
  ScanSearch,
  ListChecks,
} from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { RecentAnalysis } from "@/components/RecentAnalysis";
import { Faq } from "@/components/Faq";
import { Logo } from "@/components/Logo";
import { Tooltip } from "@/components/Tooltip";
import { PLATFORMS } from "@/lib/platforms";

const FEATURES = [
  {
    icon: Eye,
    title: "9+ Platform Previews",
    body: "See exactly how your links appear on Google, X, LinkedIn, Discord, Slack, WhatsApp, Telegram, Facebook, and iMessage.",
  },
  {
    icon: Target,
    title: "35+ Quality Checks",
    body: "Comprehensive scoring across essential tags, Open Graph, Twitter Cards, images, technical SEO, and more.",
  },
  {
    icon: Wand2,
    title: "Copy-Paste Fixes",
    body: "Get framework-specific code snippets for Next.js, Astro, Hugo, and plain HTML. Just copy and paste.",
  },
  {
    icon: ImageIcon,
    title: "Real Image Analysis",
    body: "Decoded image dimensions, file size, aspect ratio, and how it fits each platform - not just declared meta tags.",
  },
  {
    icon: FileJson,
    title: "Raw Data Export",
    body: "View and download all meta tags as JSON, CSV, or raw HTML. Perfect for documentation and debugging.",
  },
  {
    icon: Share2,
    title: "Shareable Results",
    body: "Every result has a unique URL. Share your score with your team or on social media.",
  },
  {
    icon: Download,
    title: "Export as PNG",
    body: "Generate beautiful score report cards to share on X and impress your followers.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    body: "Optimized for performance. Get results in seconds, not minutes.",
  },
  {
    icon: History,
    title: "Local History",
    body: "All your checks are saved locally. Track improvements over time without any account.",
  },
];

const STEPS = [
  {
    icon: Link2,
    title: "Paste a URL",
    body: "Drop in any public link - your homepage, a blog post, a product page.",
  },
  {
    icon: ScanSearch,
    title: "We analyze it",
    body: "Metaviewer fetches the page and runs 35+ checks across meta tags, images, and technical setup.",
  },
  {
    icon: ListChecks,
    title: "Get a scored report",
    body: "See your grade, exactly what's missing, and copy-paste fixes for every platform preview.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="px-6 pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
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
              <svg
                aria-hidden
                className="absolute -bottom-1 left-0 w-full h-3 overflow-visible"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 7 C 30 3, 55 3, 80 7 C 105 11, 130 11, 155 7 C 170 4.5, 185 4.5, 197 6"
                  stroke="rgb(var(--color-accent))"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
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
        </motion.div>
      </section>

      <RecentAnalysis />

      <section className="px-6 py-20 border-t border-border/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-instrument-serif text-2xl sm:text-3xl text-center mb-14">
            From URL to fix, in three steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 relative">
            <div className="hidden sm:block absolute top-5 left-[16.6%] right-[16.6%] h-px bg-border" />
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative text-center px-4">
                <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-accent mb-5">
                  <step.icon size={17} />
                </div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed mt-1.5 max-w-[22ch] mx-auto">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-grid border-t border-border/60">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="font-instrument-serif text-2xl sm:text-3xl mb-3">
            Beyond a pass/fail check
          </h2>
          <p className="text-muted leading-relaxed">
            Metaviewer reads your page the way a platform&apos;s crawler
            does, then hands back exactly what to change.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-lg border border-border bg-background p-6 transition-colors hover:border-accent/40"
            >
              <div className="absolute top-2 left-2 h-2.5 w-2.5 border-l border-t border-border group-hover:border-accent/50 transition-colors" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 border-r border-t border-border group-hover:border-accent/50 transition-colors" />
              <div className="absolute bottom-2 left-2 h-2.5 w-2.5 border-l border-b border-border group-hover:border-accent/50 transition-colors" />
              <div className="absolute bottom-2 right-2 h-2.5 w-2.5 border-r border-b border-border group-hover:border-accent/50 transition-colors" />
              <f.icon size={19} className="text-accent mb-5" />
              <h3 className="font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="px-6 py-20 border-t border-border/60">
        <h2 className="font-instrument-serif text-2xl sm:text-3xl text-center mb-10">
          Questions people actually ask
        </h2>
        <div className="max-w-2xl mx-auto">
          <Faq />
        </div>
      </section>


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
              <a
                href="https://github.com/bilalmlkdev"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border shadow-xs text-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors"
              >
                <Github size={16} />
              </a>
            </Tooltip>
            <Tooltip label="Twitter">
              <a
                href="https://twitter.com/bilalmlkdev"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border shadow-xs text-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-accent/60 transition-colors"
              >
                <Twitter size={16} />
              </a>
            </Tooltip>
          </div>
        </div>
        <div
          className="flex items-center justify-center overflow-hidden pointer-events-none select-none leading-[1]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)",
          }}
        >
          <span className="text-[80px] sm:text-[120px] md:text-[200px]  font-bold tracking-[-18px] text-fg/[0.04]">
            Metaviewer
          </span>
        </div>
        <p className="text-xs text-muted mt-6">
          © {new Date().getFullYear()} Metaviewer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
