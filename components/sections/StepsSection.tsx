import { STEPS } from "@/lib/content";

export function StepsSection() {
  return (
    <section className="px-6 py-20 border-t border-border/60">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-instrument-serif text-2xl sm:text-3xl text-center mb-16">
          From URL to fix, in three steps
        </h2>
        <div className="flex flex-col gap-0 relative">
          <div className="hidden sm:block absolute top-5 left-8 bottom-0 w-px bg-border" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative pl-16 pb-10 last:pb-0">
              <div className="absolute left-4 top-1 h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center text-accent">
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed mt-1.5 max-w-xl">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
