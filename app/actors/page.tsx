import type { Metadata } from "next";
import { getEntitiesByType } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import type { ActorEntity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Actors",
  description:
    "Institutions, conservation teams, government agencies, and funders working on earthen heritage in the Saharan-Maghreb.",
};

export default function ActorsIndexPage() {
  const entities = getEntitiesByType<ActorEntity>("actor").sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
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
