import type { Metadata } from "next";
import { getEntitiesByType } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import type { AtlasEntity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "Geographic database of documented earthen heritage sites across the Saharan-Maghreb region.",
};

export default function AtlasIndexPage() {
  const entities = getEntitiesByType<AtlasEntity>("atlas").sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Atlas
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Documented Sites</h1>
        <p className="text-secondary max-w-prose">
          A geographic database of documented earthen heritage sites across the
          Saharan-Maghreb region.
        </p>
      </header>
      <ul className="divide-y divide-border">
        {entities.map((entity) => (
          <li key={entity.id} className="py-4">
            <EntityLink entity={entity} />
            <div className="text-meta text-tertiary mt-1 font-mono">
              {entity.country} · {entity.condition}
              {entity.unesco_status ? ` · ${entity.unesco_status}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
