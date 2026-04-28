import EntityLink from "@/components/shared/EntityLink";
import { getEntity } from "@/lib/graph";
import type { EntityID } from "@/lib/types";

interface Section {
  label: string;
  ids: EntityID[];
}

interface Props {
  sections: Section[];
}

export default function ReferencesPanel({ sections }: Props) {
  const nonEmpty = sections.filter((s) => s.ids?.length > 0);
  if (!nonEmpty.length) return null;

  return (
    <div className="border-t border-border pt-6 mt-8">
      <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
        References
      </h2>
      <div className="space-y-4">
        {nonEmpty.map((section, i) => (
          <div key={i}>
            <p className="text-meta text-tertiary mb-2">{section.label}</p>
            <ul className="space-y-1 text-sm">
              {section.ids.map((id) => {
                const entity = getEntity(id);
                if (!entity) return null;
                return (
                  <li key={id}>
                    <EntityLink entity={entity} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
