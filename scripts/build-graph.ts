import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHtml } from "../lib/markdown";
import type {
  AtlasPoint,
  BacklinkRef,
  Backlinks,
  Entity,
  EntityID,
  EntityType,
  Graph,
} from "../lib/types";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const LIB_DIR = path.join(ROOT, "lib");
const PUBLIC_DIR = path.join(ROOT, "public");

const ENTITY_DIRS: Record<string, EntityType> = {
  typology: "typology",
  atlas: "atlas",
  library: "library",
  actors: "actor",
  persons: "person",
  glossary: "glossary",
  timeline: "timeline",
  essays: "essay",
};

const ID_PREFIX: Record<EntityType, string> = {
  typology: "type-",
  atlas: "atlas-",
  library: "lib-",
  actor: "actor-",
  person: "person-",
  glossary: "term-",
  timeline: "event-",
  essay: "essay-",
};

interface RelationSpec {
  field: string;
  label: string;
}

const REFERENCE_RELATIONS: Record<EntityType, RelationSpec[]> = {
  typology: [
    { field: "confusion_with", label: "confused with" },
    { field: "key_examples", label: "example of" },
    { field: "sources", label: "cites" },
  ],
  atlas: [
    { field: "typology", label: "instance of" },
    { field: "documented_by", label: "documents" },
    { field: "sources", label: "cites" },
  ],
  library: [
    { field: "authors", label: "authored by" },
    { field: "documents_sites", label: "documents" },
    { field: "discusses_typology", label: "discusses" },
    { field: "mentions_actors", label: "mentions" },
  ],
  actor: [
    { field: "headquartered_at", label: "headquarters of" },
    { field: "key_publications", label: "published by" },
    { field: "works_on_sites", label: "worked on by" },
  ],
  person: [
    { field: "affiliation", label: "affiliated with" },
    { field: "authored", label: "authored by" },
  ],
  glossary: [
    { field: "related_terms", label: "related to" },
    { field: "referenced_in", label: "references" },
  ],
  timeline: [
    { field: "sites", label: "event at" },
    { field: "actors", label: "event involving" },
    { field: "library_refs", label: "event documented in" },
  ],
  essay: [
    { field: "referenced_sites", label: "discussed in" },
    { field: "referenced_library", label: "cited in" },
    { field: "referenced_actors", label: "mentioned in" },
  ],
};

interface ValidationError {
  file: string;
  message: string;
}

const errors: ValidationError[] = [];

function displayName(e: Entity): string {
  switch (e.type) {
    case "typology":
      return e.name_en;
    case "glossary":
      return e.term_en;
    case "library":
    case "timeline":
    case "essay":
      return e.title;
    default:
      return (e as { name?: string }).name ?? e.slug;
  }
}

async function readEntities(): Promise<Entity[]> {
  const entities: Entity[] = [];

  for (const [folder, type] of Object.entries(ENTITY_DIRS)) {
    const dir = path.join(CONTENT_DIR, folder);
    let files: string[] = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      continue;
    }

    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
      const full = path.join(dir, file);
      const raw = await fs.readFile(full, "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.(md|mdx)$/, "");
      const sourcePath = path.relative(ROOT, full);

      if (data.type && data.type !== type) {
        errors.push({
          file: sourcePath,
          message: `frontmatter type "${data.type}" does not match folder type "${type}"`,
        });
      }

      const id = (data.id as string) ?? `${ID_PREFIX[type]}${slug}`;
      if (!id.startsWith(ID_PREFIX[type])) {
        errors.push({
          file: sourcePath,
          message: `id "${id}" must start with prefix "${ID_PREFIX[type]}"`,
        });
      }

      const html = await markdownToHtml(content);

      const entity = {
        ...data,
        type,
        id,
        slug: data.slug ?? slug,
        body: html,
        bodyMarkdown: content,
      } as Entity;

      entities.push(entity);
    }
  }

  return entities;
}

function validateReferences(entities: Entity[]): Map<EntityID, Entity> {
  const byId = new Map<EntityID, Entity>();

  for (const e of entities) {
    if (byId.has(e.id)) {
      errors.push({
        file: e.slug,
        message: `duplicate id "${e.id}"`,
      });
      continue;
    }
    byId.set(e.id, e);
  }

  for (const e of entities) {
    const fields = REFERENCE_RELATIONS[e.type] ?? [];
    for (const { field } of fields) {
      const v = (e as unknown as Record<string, unknown>)[field];
      if (v == null) continue;
      const refs = Array.isArray(v) ? v : [v];
      for (const ref of refs) {
        if (typeof ref !== "string") {
          errors.push({
            file: e.id,
            message: `field "${field}" contains a non-string reference`,
          });
          continue;
        }
        if (!byId.has(ref)) {
          errors.push({
            file: e.id,
            message: `field "${field}" references unknown entity "${ref}"`,
          });
        }
      }
    }
  }

  return byId;
}

function buildBacklinks(entities: Entity[], byId: Map<EntityID, Entity>): Backlinks {
  const backlinks: Backlinks = {};

  for (const e of entities) {
    const fields = REFERENCE_RELATIONS[e.type] ?? [];
    for (const { field, label } of fields) {
      const v = (e as unknown as Record<string, unknown>)[field];
      if (v == null) continue;
      const refs = Array.isArray(v) ? v : [v];
      for (const ref of refs) {
        if (typeof ref !== "string") continue;
        const target = byId.get(ref);
        if (!target) continue;
        if (!backlinks[ref]) backlinks[ref] = [];
        const blRef: BacklinkRef = {
          id: e.id,
          type: e.type,
          name: displayName(e),
          relation: label,
        };
        backlinks[ref].push(blRef);
      }
    }
  }

  return backlinks;
}

function buildAtlasPoints(entities: Entity[]): AtlasPoint[] {
  return entities
    .filter((e): e is Extract<Entity, { type: "atlas" }> => e.type === "atlas")
    .map((e) => ({
      id: e.id,
      name: e.name,
      lat: e.lat,
      lng: e.lng,
      condition: e.condition,
      country: e.country,
      typology: e.typology,
      unesco_status: e.unesco_status ?? null,
    }));
}

async function main() {
  const validateOnly = process.argv.includes("--validate-only");

  await fs.mkdir(LIB_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const entities = await readEntities();
  const byId = validateReferences(entities);

  if (errors.length > 0) {
    console.error(`\nGraph validation failed with ${errors.length} error(s):\n`);
    for (const e of errors) console.error(`  ${e.file}: ${e.message}`);
    process.exit(1);
  }

  const graph: Graph = {
    entities: Object.fromEntries(entities.map((e) => [e.id, e])),
    backlinks: buildBacklinks(entities, byId),
  };

  if (validateOnly) {
    console.log(`Validated ${entities.length} entities, no errors.`);
    return;
  }

  await fs.writeFile(path.join(LIB_DIR, "graph.json"), JSON.stringify(graph, null, 2));
  await fs.writeFile(
    path.join(PUBLIC_DIR, "atlas-points.json"),
    JSON.stringify(buildAtlasPoints(entities), null, 2)
  );

  const counts: Record<EntityType, number> = {
    typology: 0,
    atlas: 0,
    library: 0,
    actor: 0,
    person: 0,
    glossary: 0,
    timeline: 0,
    essay: 0,
  };
  for (const e of entities) counts[e.type]++;

  console.log(
    `Built graph: ${entities.length} entities ` +
      Object.entries(counts)
        .filter(([, n]) => n > 0)
        .map(([t, n]) => `${t}=${n}`)
        .join(" ")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
