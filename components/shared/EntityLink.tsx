import Link from "next/link";
import { getEntity } from "@/lib/graph";
import { pathFor, labelFor } from "@/lib/utils";
import type { EntityID } from "@/lib/types";

interface Props {
  id: EntityID;
  showType?: boolean;
}

function entityName(e: ReturnType<typeof getEntity>): string {
  if (!e) return "";
  switch (e.type) {
    case "typology":
      return e.name_en;
    case "glossary":
      return e.term_en;
    default:
      return (e as { name?: string; title?: string }).name ?? (e as { title?: string }).title ?? e.slug;
  }
}

export default function EntityLink({ id, showType }: Props) {
  const e = getEntity(id);
  if (!e) {
    return (
      <span className="font-mono text-sm text-tertiary line-through" title="Unresolved reference">
        {id}
      </span>
    );
  }
  return (
    <Link href={pathFor(e.type, e.slug)} className="text-ink no-underline hover:text-accent">
      {entityName(e)}
      {showType ? (
        <span className="ml-2 font-mono text-xs uppercase tracking-wider text-tertiary">
          {labelFor(e.type)}
        </span>
      ) : null}
    </Link>
  );
}
