import type { Metadata } from "next";
import { getEntitiesByType } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import JsonLd from "@/components/shared/JsonLd";
import { collectionJsonLd } from "@/lib/schema-org";
import type { ActorEntity } from "@/lib/types";

const DESCRIPTION =
  "Institutions, conservation teams, government agencies, and funders working on earthen heritage in the Saharan-Maghreb.";

export const metadata: Metadata = {
  title: "Actors",
  description: DESCRIPTION,
  alternates: { canonical: "/actors" },
  openGraph: {
    type: "website",
    url: "/actors",
    title: "Actors — Ksour",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "Actors — Ksour", description: DESCRIPTION },
};

export default function ActorsIndexPage() {
  const entities = getEntitiesByType<ActorEntity>("actor").sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd
        data={collectionJsonLd({
          name: "Actors — Ksour",
          description: DESCRIPTION,
          path: "/actors",
          items: entities.map((e) => ({
            name: e.full_name ?? e.name,
            url: `/actors/${e.slug}`,
          })),
        })}
      />
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Actors
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Institutions &amp; Teams</h1>
        <p className="text-secondary max-w-prose">
          Government agencies, conservation teams, universities, NGOs, and
          funders working on earthen heritage in the Saharan-Maghreb.
        </p>
      </header>
      <ul className="divide-y divide-border">
        {entities.map((entity) => (
          <li key={entity.id} className="py-4">
            <EntityLink entity={entity} />
            <div className="text-meta text-tertiary mt-1 font-mono">
              {entity.actor_type}
              {entity.country ? ` · ${entity.country}` : ""}
              {entity.active_period ? ` · ${entity.active_period}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
