import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import { getEntitiesByType } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Typology",
  description:
    "Building types of the Saharan-Maghreb earthen tradition: kasbah, ksar, igherm, agadir, tighremt, ghorfa, and related forms.",
};

export default function TypologyIndex() {
  const types = getEntitiesByType("typology").sort((a, b) =>
    a.name_en.localeCompare(b.name_en)
  );
  return (
    <>
      <PageHeader
        eyebrow="Index"
        title="Typology"
        dek="Building types covered by the archive. The source-of-truth for terminology used elsewhere across the project."
      />
      <div className="mx-auto max-w-page px-6 py-12">
        {types.length === 0 ? (
          <p className="text-secondary text-sm max-w-prose">
            No entries yet. Typology nodes will appear here once seeded into{" "}
            <code>content/typology/</code>.
          </p>
        ) : (
          <ul className="divide-y divide-rule">
            {types.map((t) => (
              <li key={t.id} className="py-5 grid md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <Link
                    href={`/typology/${t.slug}`}
                    className="font-serif text-2xl no-underline hover:text-accent"
                  >
                    {t.name_en}
                  </Link>
                  {t.plural_form ? (
                    <p className="text-tertiary text-xs mt-1">{t.plural_form}</p>
                  ) : null}
                </div>
                <div className="md:col-span-8 text-secondary text-sm">
                  {t.definition_short}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
