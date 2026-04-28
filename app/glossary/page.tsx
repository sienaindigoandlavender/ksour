import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import { getEntitiesByType } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Multilingual lexicon of construction terms — Tamazight, Darija, Arabic, French, English — used across the earthen building tradition.",
};

export default function GlossaryIndex() {
  const terms = getEntitiesByType("glossary").sort((a, b) => a.term_en.localeCompare(b.term_en));

  return (
    <>
      <PageHeader
        eyebrow="Lexicon"
        title="Glossary"
        dek="Multilingual construction lexicon. Tamazight (with Tifinagh where standardised), Darija, Arabic, French, English."
      />
      <div className="mx-auto max-w-page px-6 py-12">
        {terms.length === 0 ? (
          <p className="text-secondary text-sm max-w-prose">No entries yet.</p>
        ) : (
          <ul className="divide-y divide-rule">
            {terms.map((t) => (
              <li key={t.id} className="py-4 grid md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <Link
                    href={`/glossary/${t.slug}`}
                    className="font-serif text-lg no-underline hover:text-accent italic"
                  >
                    {t.term_en}
                  </Link>
                  <p className="meta mt-1">{t.category}</p>
                </div>
                <div className="md:col-span-9 text-sm text-secondary">
                  {[t.term_arabic, t.term_french, t.term_tamazight].filter(Boolean).join(" · ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
