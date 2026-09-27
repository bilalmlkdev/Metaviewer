import { Faq } from "@/components/Faq";

export function FaqSection() {
  return (
    <section className="px-6 py-20 bg-grid border-t border-border/60">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <h2 className="font-instrument-serif text-2xl sm:text-3xl mb-3">
          Questions people actually ask
        </h2>
        <p className="text-muted leading-relaxed">
          Everything you need to know about link preview analysis.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <Faq />
      </div>
    </section>
  );
}
