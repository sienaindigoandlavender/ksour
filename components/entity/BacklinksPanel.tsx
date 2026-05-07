import Link from "next/link";
import { getBacklinks, isPublicType } from "@/lib/graph";
import type { BacklinkRef, EntityType } from "@/lib/types";

interface Props {
  entityId: string;
}

const routePrefixes: Record<EntityType, string> = {
  typology: "/typology",
  atlas: "/atlas",
  library: "/library",
  actor: "/actors",
  person: "",
  glossary: "/glossary",
  timeline: "/timeline",
  essay: "/essays",
};

export default function BacklinksPanel({ entityId }: Props) {
  const backlinks = getBacklinks(entityId).filter((bl) => isPublicType(bl.type));
  if (!backlinks.length) return null;

  const grouped: Record<string, BacklinkRef[]> = {};
  for (const bl of backlinks) {
    if (!grouped[bl.relation]) grouped[bl.relation] = [];
    grouped[bl.relation].push(bl);
  }

  return (
    <div className="border-t border-border pt-6 mt-8">
      <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
        Referenced in
      </h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([relation, refs]) => (
          <div key={relation}>
            <p className="text-meta text-tertiary mb-2">{relation}</p>
            <ul className="space-y-1 text-sm">
              {refs.map((ref) => {
                const slug = ref.id.replace(/^[^-]+-/, "");
                return (
                  <li key={ref.id}>
                    <Link
                      href={`${routePrefixes[ref.type]}/${slug}`}
                      className="text-ink hover:text-accent border-b border-border hover:border-accent transition-colors"
                    >
                      {ref.name}
                    </Link>
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
