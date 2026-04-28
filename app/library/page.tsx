import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import { getEntitiesByType, getEntity } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Indexed bibliography of public academic papers, institutional reports, books, and substantive articles on Saharan-Maghreb earthen architecture.",
};

export default function LibraryIndex() {
  const entries = getEntitiesByType("library").sort(
    (a, b) => b.year - a.year || a.title.localeCompare(b.title)
  );

  return (
    <>
      <PageHeader
        eyebrow="Bibliography"
        title="Library"
        dek="Public academic papers, institutional reports, books, theses, and substantive articles, indexed and synthesised."
      />
      <div className="mx-auto max-w-page px-6 py-12">
        {entries.length === 0 ? (
          <p className="text-secondary text-sm max-w-prose">
            No entries yet. Library nodes will appear here once seeded into{" "}
            <code>content/library/</code>.
          </p>
        ) : (
          <ul className="divide-y divide-rule">
            {entries.map((e) => {
              const authors = (e.authors ?? [])
                .map((id) => {
                  const a = getEntity(id);
                  return a && "name" in a ? a.name : id;
                })
                .join(", ");
              return (
                <li key={e.id} className="py-5 grid md:grid-cols-12 gap-4">
                  <div className="md:col-span-1 meta">{e.year}</div>
                  <div className="md:col-span-7">
                    <Link
                      href={`/library/${e.slug}`}
                      className="font-serif text-lg leading-snug no-underline hover:text-accent"
                    >
                      {e.title}
                    </Link>
                    {authors ? (
                      <p className="text-secondary text-sm mt-1">{authors}</p>
                    ) : null}
                  </div>
                  <div className="md:col-span-2 text-sm text-secondary">{e.publication}</div>
                  <div className="md:col-span-2">
                    <span className="meta">{e.publication_type}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
