import type { Metadata } from "next";
import { getEntitiesByType } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import type { GlossaryEntity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Multilingual lexicon of construction terms — Tamazight, Darija, Arabic, French, English — used across the earthen building tradition.",
};

export default function GlossaryIndexPage() {
  const entities = getEntitiesByType<GlossaryEntity>("glossary").sort((a, b) =>
    a.term_en.localeCompare(b.term_en)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Glossary
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Construction Lexicon</h1>
        <p className="text-secondary max-w-prose">
          Multilingual lexicon of construction terms — Tamazight (with Tifinagh
          where standardised), Darija, Arabic, French, English.
        </p>
      </header>
      <ul className="divide-y divide-border">
        {entities.map((entity) => (
          <li key={entity.id} className="py-4">
            <EntityLink entity={entity} />
            <div className="text-meta text-tertiary mt-1 font-mono">
              {entity.category}
              {entity.term_arabic ? ` · ${entity.term_arabic}` : ""}
              {entity.term_french ? ` · ${entity.term_french}` : ""}
              {entity.term_tamazight ? ` · ${entity.term_tamazight}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
