import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Methodology and citation guidance for the Ksour synthesis archive.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About — Ksour",
    description:
      "Methodology and citation guidance for the Ksour synthesis archive.",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <article className="max-w-prose">
        <header className="mb-12 pb-8 border-b border-border">
          <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
            About
          </p>
          <h1 className="font-serif text-4xl text-ink mb-3">Methodology</h1>
        </header>

        <div className="prose-content">
          <p>
            Ksour is a synthesis archive. It does not contain original
            fieldwork. It indexes, paraphrases, and structurally connects the
            published institutional and academic record on earthen
            architectural heritage across the Saharan-Maghreb region.
          </p>

          <h2>Sources</h2>
          <p>
            Every entity links to the sources from which it draws. Where
            sources disagree, the disagreement is noted. Where the record is
            silent, the silence is acknowledged rather than filled with
            speculation.
          </p>

          <h2>Translation</h2>
          <p>
            The corpus exists in English, French, Spanish, Italian, Arabic,
            and German. Synthesis is published in English. Source-language
            terms are preserved in the glossary and in entity metadata.
          </p>

          <h2>Citation</h2>
          <p>The archive is published in the public interest. Suggested citation:</p>
          <blockquote>
            Ksour Archive. (Year). [Entity name]. https://www.ksour.org/[type]/[slug]
          </blockquote>

          <h2>Scope</h2>
          <p>
            Phase 1 covers Morocco at depth, with sketch coverage of
            Mauritania, Algeria, Libya, Tunisia, Mali, and Niger. The Moroccan
            emphasis reflects the density of the published record, not the
            relative significance of the architecture.
          </p>
        </div>
      </article>
    </div>
  );
}
