import EntityLink from "@/components/shared/EntityLink";
import { getEntity, isPublic } from "@/lib/graph";
import type { Entity, EntityID } from "@/lib/types";

interface Section {
  label: string;
  ids: EntityID[];
}

interface Props {
  sections: Section[];
}

interface ResolvedSection {
  label: string;
  entities: Entity[];
}

export default function ReferencesPanel({ sections }: Props) {
  const resolved: ResolvedSection[] = sections
    .map((s) => ({
      label: s.label,
      entities: (s.ids ?? [])
        .map((id) => getEntity(id))
        .filter((e): e is Entity => e !== null && isPublic(e)),
    }))
    .filter((s) => s.entities.length > 0);

  if (resolved.length === 0) return null;

  return (
    <div className="border-t border-border pt-6 mt-8">
      <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
        References
      </h2>
      <div className="space-y-4">
        {resolved.map((section, i) => (
          <div key={i}>
            <p className="text-meta text-tertiary mb-2">{section.label}</p>
            <ul className="space-y-1 text-sm">
              {section.entities.map((entity) => (
                <li key={entity.id}>
                  <EntityLink entity={entity} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
