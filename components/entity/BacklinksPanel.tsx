import EntityLink from "@/components/shared/EntityLink";
import { getBacklinks } from "@/lib/graph";
import { labelFor, groupBy } from "@/lib/utils";
import type { EntityID, EntityType } from "@/lib/types";

interface Props {
  id: EntityID;
}

export default function BacklinksPanel({ id }: Props) {
  const data = getBacklinks(id);
  if (!data || data.referencedBy.length === 0) return null;

  const byType = groupBy(data.referencedBy, (r) => r.type);

  return (
    <section>
      <p className="meta mb-4">Referenced in</p>
      <ul className="space-y-3 text-sm">
        {(Object.entries(byType) as [EntityType, typeof data.referencedBy][]).map(
          ([type, refs]) => (
            <li key={type}>
              <p className="meta normal-case tracking-wider text-tertiary mb-1">
                {labelFor(type)}
              </p>
              <ul className="space-y-1">
                {refs.map((r) => (
                  <li key={`${r.id}-${r.relation}`}>
                    <EntityLink id={r.id} />
                    <span className="meta ml-2">{r.relation.replace(/_/g, " ")}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    </section>
  );
}
