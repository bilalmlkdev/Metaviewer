import { FEATURES } from "@/lib/content";

export function FeaturesSection() {
  return (
    <section className="px-6 py-20 border-t border-border/60">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="font-instrument-serif text-2xl sm:text-3xl mb-4">
          Beyond a pass/fail check
        </h2>
        <p className="text-muted leading-relaxed max-w-lg mx-auto">
          Metaviewer reads your page the way a platform&apos;s crawler
          does, then hands back exactly what to change.
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col">
        {FEATURES.slice(0, 5).map((f) => (
          <div key={f.title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0 border-b border-border/40 last:border-0">
            <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted group-hover:border-accent/40 transition-colors">
              <f.icon size={15} className="text-accent" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium">{f.title}</h3>
              <p className="text-xs text-muted leading-relaxed mt-0.5">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
