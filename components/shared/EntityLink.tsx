import Link from "next/link";
import type { Entity, EntityType } from "@/lib/types";
import { isPublic } from "@/lib/graph";

const routePrefixes: Record<EntityType, string> = {
  typology: "/typology",
  atlas: "/atlas",
  library: "/library",
  actor: "/actors",
  person: "/persons",
  glossary: "/glossary",
  timeline: "/timeline",
  essay: "/essays",
};

function getDisplayName(entity: Entity): string {
  switch (entity.type) {
    case "typology":
      return entity.name_en;
    case "atlas":
      return entity.name;
    case "library":
      return entity.title;
    case "actor":
      return entity.name;
    case "glossary":
      return entity.term_en;
    case "timeline":
      return entity.title;
    case "essay":
      return entity.title;
    case "person":
      return entity.name;
  }
}

interface Props {
  entity: Entity;
}

export default function EntityLink({ entity }: Props) {
  if (!isPublic(entity)) return null;
  // Timeline events have no detail pages — link to the chronology itself.
  const href =
    entity.type === "timeline"
      ? "/timeline"
      : `${routePrefixes[entity.type]}/${entity.slug}`;
  return (
    <Link
      href={href}
      className="text-ink hover:text-accent border-b border-border hover:border-accent transition-colors"
    >
      {getDisplayName(entity)}
    </Link>
  );
}
