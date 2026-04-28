import graphData from "./graph.json";
import type {
  BacklinkRef,
  Entity,
  EntityID,
  EntityType,
  Graph,
} from "./types";

const graph = graphData as unknown as Graph;

export function getEntity(id: EntityID): Entity | null {
  return graph.entities[id] ?? null;
}

export function getEntitiesByType<T extends Entity>(type: EntityType): T[] {
  return Object.values(graph.entities).filter((e) => e.type === type) as T[];
}

export function getBacklinks(id: EntityID): BacklinkRef[] {
  return graph.backlinks[id] ?? [];
}

export function getEntityBySlug(type: EntityType, slug: string): Entity | null {
  return (
    Object.values(graph.entities).find((e) => e.type === type && e.slug === slug) ??
    null
  );
}

export function getAllSlugs(type: EntityType): string[] {
  return getEntitiesByType(type).map((e) => e.slug);
}

export function counts(): Record<EntityType, number> {
  const out: Record<EntityType, number> = {
    typology: 0,
    atlas: 0,
    library: 0,
    actor: 0,
    person: 0,
    glossary: 0,
    timeline: 0,
    essay: 0,
  };
  for (const e of Object.values(graph.entities)) out[e.type]++;
  return out;
}
