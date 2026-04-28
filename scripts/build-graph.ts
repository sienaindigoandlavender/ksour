import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
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

const REFERENCE_FIELDS: Record<EntityType, string[]> = {
  typology: ["confusion_with", "key_examples", "sources"],
  atlas: ["typology", "documented_by", "sources"],
  library: ["authors", "documents_sites", "discusses_typology", "mentions_actors"],
  actor: ["headquartered_at", "key_publications", "works_on_sites"],
  person: ["affiliation", "authored"],
  glossary: ["related_terms", "referenced_in"],
  timeline: ["sites", "actors", "library_refs"],
  essay: ["referenced_sites", "referenced_library", "referenced_actors"],
};

interface ValidationError {
  file: string;
  message: string;
}

const errors: ValidationError[] = [];
const warnings: string[] = [];

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
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

      if (data.type && data.type !== type) {
        errors.push({
          file: full,
          message: `frontmatter type "${data.type}" does not match folder type "${type}"`,
        });
      }

      const id = (data.id as string) ?? `${ID_PREFIX[type]}${slug}`;
      if (!id.startsWith(ID_PREFIX[type])) {
        errors.push({
          file: full,
          message: `id "${id}" must start with prefix "${ID_PREFIX[type]}"`,
        });
      }

      const html = (await remark().use(remarkGfm).use(remarkHtml).process(content)).toString();

      const entity = {
        ...data,
        type,
        id,
        slug: data.slug ?? slug,
        body: content,
        bodyHtml: html,
        sourcePath: path.relative(ROOT, full),
      } as Entity;

      entities.push(entity);
    }
  }

  return entities;
}

function validate(entities: Entity[]): { byId: Map<EntityID, Entity> } {
  const byId = new Map<EntityID, Entity>();

  for (const e of entities) {
    if (byId.has(e.id)) {
      errors.push({
        file: e.sourcePath,
        message: `duplicate id "${e.id}" (also defined in ${byId.get(e.id)!.sourcePath})`,
      });
      continue;
    }
    byId.set(e.id, e);
  }

  for (const e of entities) {
    const fields = REFERENCE_FIELDS[e.type] ?? [];
    for (const field of fields) {
      const v = (e as unknown as Record<string, unknown>)[field];
      if (v == null) continue;
      const refs = Array.isArray(v) ? v : [v];
      for (const ref of refs) {
        if (typeof ref !== "string") {
          errors.push({
            file: e.sourcePath,
            message: `field "${field}" contains a non-string reference`,
          });
          continue;
        }
        if (!byId.has(ref)) {
          errors.push({
            file: e.sourcePath,
            message: `field "${field}" references unknown entity "${ref}"`,
          });
        }
      }
    }
  }

  return { byId };
}

function buildBacklinks(entities: Entity[]): Backlinks {
  const backlinks: Backlinks = {};

  const ensure = (id: EntityID) => {
    if (!backlinks[id]) backlinks[id] = { referencedBy: [] };
    return backlinks[id];
  };

  for (const e of entities) {
    const fields = REFERENCE_FIELDS[e.type] ?? [];
    for (const field of fields) {
      const v = (e as unknown as Record<string, unknown>)[field];
      if (v == null) continue;
      const refs = Array.isArray(v) ? v : [v];
      for (const ref of refs) {
        if (typeof ref !== "string") continue;
        const ref_: BacklinkRef = { id: e.id, type: e.type, relation: field };
        ensure(ref).referencedBy.push(ref_);
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
  validate(entities);

  if (errors.length > 0) {
    console.error(`\nGraph validation failed with ${errors.length} error(s):\n`);
    for (const e of errors) {
      console.error(`  ${e.file}: ${e.message}`);
    }
    process.exit(1);
  }

  const byType = Object.fromEntries(
    Object.values(ENTITY_DIRS).map((t) => [t, [] as EntityID[]])
  ) as Record<EntityType, EntityID[]>;

  for (const e of entities) byType[e.type].push(e.id);

  const graph: Graph = {
    entities: Object.fromEntries(entities.map((e) => [e.id, e])),
    byType,
    backlinks: buildBacklinks(entities),
    generatedAt: new Date().toISOString(),
  };

  if (validateOnly) {
    console.log(`Validated ${entities.length} entities, no errors.`);
    return;
  }

  const meta = {
    generatedAt: graph.generatedAt,
    counts: Object.fromEntries(
      Object.entries(byType).map(([t, ids]) => [t, ids.length])
    ),
    backlinks: graph.backlinks,
  };

  await fs.writeFile(path.join(LIB_DIR, "graph.json"), JSON.stringify(graph, null, 2));
  await fs.writeFile(path.join(LIB_DIR, "graph-meta.json"), JSON.stringify(meta, null, 2));
  await fs.writeFile(
    path.join(PUBLIC_DIR, "atlas-points.json"),
    JSON.stringify(buildAtlasPoints(entities), null, 2)
  );

  console.log(
    `Built graph: ${entities.length} entities ` +
      Object.entries(byType)
        .filter(([, ids]) => ids.length > 0)
        .map(([t, ids]) => `${t}=${ids.length}`)
        .join(" ") +
      (warnings.length ? ` (${warnings.length} warning(s))` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

void isStringArray;
