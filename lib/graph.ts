import type {
  Backlinks,
  Entity,
  EntityID,
  EntityType,
  Graph,
} from "@/lib/types";

let cached: Graph | null = null;

function load(): Graph {
  if (cached) return cached;
  try {
    const data = require("./graph.json") as Graph;
    cached = data;
    return data;
  } catch {
    cached = {
      entities: {},
      byType: {
        typology: [],
        atlas: [],
        library: [],
        actor: [],
        person: [],
        glossary: [],
        timeline: [],
        essay: [],
      },
      backlinks: {},
      generatedAt: new Date(0).toISOString(),
    };
    return cached;
  }
}

export function getGraph(): Graph {
  return load();
}

export function getEntity(id: EntityID): Entity | undefined {
  return load().entities[id];
}

export function getEntityBySlug<T extends EntityType>(
  type: T,
  slug: string
): Extract<Entity, { type: T }> | undefined {
  const g = load();
  for (const id of g.byType[type] ?? []) {
    const e = g.entities[id];
    if (e?.slug === slug) return e as Extract<Entity, { type: T }>;
  }
  return undefined;
}

export function getEntitiesByType<T extends EntityType>(
  type: T
): Array<Extract<Entity, { type: T }>> {
  const g = load();
  return (g.byType[type] ?? [])
    .map((id) => g.entities[id])
    .filter((e): e is Extract<Entity, { type: T }> => e?.type === type);
}

export function getBacklinks(id: EntityID): Backlinks[string] | undefined {
  return load().backlinks[id];
}

export function counts(): Record<EntityType, number> {
  const g = load();
  return Object.fromEntries(
    Object.entries(g.byType).map(([t, ids]) => [t, ids.length])
  ) as Record<EntityType, number>;
}
