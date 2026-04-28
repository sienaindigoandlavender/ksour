import EntityLink from "@/components/shared/EntityLink";
import { getEntity } from "@/lib/graph";
import { labelFor, groupBy } from "@/lib/utils";
import type { EntityID, EntityType } from "@/lib/types";

interface Group {
  label: string;
  ids: EntityID[];
}

interface Props {
  groups: Group[];
  heading?: string;
}

export default function ReferencesPanel({ groups, heading = "References" }: Props) {
  const populated = groups.filter((g) => g.ids && g.ids.length > 0);
  if (populated.length === 0) return null;

  return (
    <section>
      <p className="meta mb-4">{heading}</p>
      <div className="space-y-5 text-sm">
        {populated.map((group) => {
          const resolved = group.ids
            .map((id) => ({ id, e: getEntity(id) }))
            .filter((x) => x.e);
          if (resolved.length === 0) return null;
          const byType = groupBy(resolved, (x) => x.e!.type);
          return (
            <div key={group.label}>
              <p className="meta normal-case tracking-wider text-tertiary mb-2">
                {group.label}
              </p>
              <ul className="space-y-1">
                {Object.entries(byType).map(([type, items]) => (
                  <li key={type}>
                    <span className="meta mr-2">{labelFor(type as EntityType)}</span>
                    <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
                      {items.map((x) => (
                        <EntityLink key={x.id} id={x.id} />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
