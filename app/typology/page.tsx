import type { Metadata } from "next";
import { getEntitiesByType } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import JsonLd from "@/components/shared/JsonLd";
import { collectionJsonLd } from "@/lib/schema-org";
import type { TypologyEntity } from "@/lib/types";

const DESCRIPTION =
  "Building types of the Saharan-Maghreb earthen tradition: kasbah, ksar, igherm, agadir, tighremt, ghorfa, and related forms.";

export const metadata: Metadata = {
  title: "Typology",
  description: DESCRIPTION,
  alternates: { canonical: "/typology" },
  openGraph: {
    type: "website",
    url: "/typology",
    title: "Typology — Ksour",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "Typology — Ksour", description: DESCRIPTION },
};

export default function TypologyIndexPage() {
  const entities = getEntitiesByType<TypologyEntity>("typology").sort((a, b) =>
    a.name_en.localeCompare(b.name_en)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd
        data={collectionJsonLd({
          name: "Typology — Ksour",
          description: DESCRIPTION,
          path: "/typology",
          items: entities.map((e) => ({ name: e.name_en, url: `/typology/${e.slug}` })),
        })}
      />
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Typology
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Building Types</h1>
        <p className="text-secondary max-w-prose">
          Source-of-truth for the building-type terminology used elsewhere in
          the archive: kasbah, ksar, igherm, agadir, tighremt, ghorfa, and
          related forms.
        </p>
      </header>
      <ul className="divide-y divide-border">
        {entities.map((entity) => (
          <li key={entity.id} className="py-6">
            <EntityLink entity={entity} />
            <p className="text-secondary mt-2 max-w-prose">
              {entity.definition_short}
            </p>
            <p className="text-meta text-tertiary mt-2 font-mono">
              {entity.regions?.join(" · ")}
              {entity.materials?.length ? ` · ${entity.materials.join(", ")}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
