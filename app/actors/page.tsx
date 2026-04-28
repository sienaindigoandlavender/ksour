import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import { getEntitiesByType } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Actors",
  description:
    "Institutions, conservation teams, and government agencies working on earthen heritage in the Saharan-Maghreb.",
};

export default function ActorsIndex() {
  const actors = getEntitiesByType("actor").sort((a, b) => a.name.localeCompare(b.name));
  const persons = getEntitiesByType("person").sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader
        eyebrow="Index"
        title="Actors"
        dek="Institutions, conservation teams, government agencies, funders — and the individual researchers attached to them."
      />
      <div className="mx-auto max-w-page px-6 py-12 grid md:grid-cols-2 gap-12">
        <section>
          <p className="meta mb-4">Institutions &amp; teams</p>
          {actors.length === 0 ? (
            <p className="text-secondary text-sm">No entries yet.</p>
          ) : (
            <ul className="divide-y divide-rule">
              {actors.map((a) => (
                <li key={a.id} className="py-4">
                  <Link
                    href={`/actors/${a.slug}`}
                    className="font-serif text-lg no-underline hover:text-accent"
                  >
                    {a.name}
                  </Link>
                  <p className="meta mt-1">{a.actor_type}{a.country ? ` · ${a.country}` : ""}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <p className="meta mb-4">Persons</p>
          {persons.length === 0 ? (
            <p className="text-secondary text-sm">No entries yet.</p>
          ) : (
            <ul className="divide-y divide-rule">
              {persons.map((p) => (
                <li key={p.id} className="py-4">
                  <Link
                    href={`/persons/${p.slug}`}
                    className="font-serif text-lg no-underline hover:text-accent"
                  >
                    {p.name}
                  </Link>
                  {p.role ? <p className="meta mt-1">{p.role}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
