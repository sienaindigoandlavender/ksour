import Link from "next/link";
import type { Entity, EntityType } from "@/lib/types";

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
    case "person":
      return entity.name;
    case "glossary":
      return entity.term_en;
    case "timeline":
      return entity.title;
    case "essay":
      return entity.title;
  }
}

interface Props {
  entity: Entity;
}

export default function EntityLink({ entity }: Props) {
  return (
    <Link
      href={`${routePrefixes[entity.type]}/${entity.slug}`}
      className="text-ink hover:text-accent border-b border-border hover:border-accent transition-colors"
    >
      {getDisplayName(entity)}
    </Link>
  );
}
