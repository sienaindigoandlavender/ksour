import type { Metadata } from "next";
import { getEntitiesByType, getEntity } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import JsonLd from "@/components/shared/JsonLd";
import { collectionJsonLd } from "@/lib/schema-org";
import type { LibraryEntity, PersonEntity } from "@/lib/types";

const DESCRIPTION =
  "Indexed bibliography of public academic papers, institutional reports, books, and substantive articles on Saharan-Maghreb earthen architecture.";

export const metadata: Metadata = {
  title: "Library",
  description: DESCRIPTION,
  alternates: { canonical: "/library" },
  openGraph: {
    type: "website",
    url: "/library",
    title: "Library — Ksour",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "Library — Ksour", description: DESCRIPTION },
};

export default function LibraryIndexPage() {
  const entities = getEntitiesByType<LibraryEntity>("library").sort(
    (a, b) => b.year - a.year || a.title.localeCompare(b.title)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd
        data={collectionJsonLd({
          name: "Library — Ksour",
          description: DESCRIPTION,
          path: "/library",
          items: entities.map((e) => ({ name: e.title, url: `/library/${e.slug}` })),
        })}
      />
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Library
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Indexed Sources</h1>
        <p className="text-secondary max-w-prose">
          Public academic papers, institutional reports, books, theses, and
          substantive articles. Every claim in the archive is attributable to
          an entry here.
        </p>
      </header>
      <ul className="divide-y divide-border">
        {entities.map((entity) => {
          const authors = (entity.authors ?? [])
            .map((id) => getEntity(id) as PersonEntity | null)
            .filter(Boolean)
            .map((p) => p!.name)
            .join(", ");
          return (
            <li key={entity.id} className="py-5">
              <div className="grid grid-cols-[60px_1fr] gap-4">
                <div className="font-mono text-meta text-tertiary pt-1">
                  {entity.year}
                </div>
                <div>
                  <EntityLink entity={entity} />
                  {authors ? (
                    <p className="text-sm text-secondary mt-1">{authors}</p>
                  ) : null}
                  <p className="text-meta text-tertiary mt-1 font-mono">
                    {entity.publication} · {entity.publication_type}
                    {entity.language ? ` · ${entity.language}` : ""}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
