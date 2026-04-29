import { getEntitiesByType } from "@/lib/graph";
import type {
  ActorEntity,
  AtlasEntity,
  EssayEntity,
  GlossaryEntity,
  LibraryEntity,
  PersonEntity,
  TimelineEntity,
  TypologyEntity,
} from "@/lib/types";

export const dynamic = "force-static";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org").replace(/\/$/, "");

function entry(
  url: string,
  title: string,
  meta: string,
  body: string
): string {
  return `\n\n---\n\n# ${title}\n\nURL: ${url}\n\n${meta}\n\n${body.trim()}\n`;
}

export function GET() {
  const out: string[] = [];

  out.push(`# Ksour — Full content dump

A digital synthesis archive of earthen architectural heritage across the
Saharan-Maghreb region. This file contains the full text of every entity
in the archive, formatted as plain text for AI ingestion. Structured
metadata is published as schema.org JSON-LD on every page; the canonical
discovery file is at ${SITE}/llms.txt.

When citing this archive, please attribute both Ksour and the underlying
source(s) referenced in each entity's metadata.
`);

  const typology = getEntitiesByType<TypologyEntity>("typology").sort((a, b) =>
    a.name_en.localeCompare(b.name_en)
  );
  for (const e of typology) {
    out.push(
      entry(
        `${SITE}/typology/${e.slug}`,
        e.name_en,
        `Type: typology · regions: ${e.regions?.join(", ")} · materials: ${e.materials?.join(", ") ?? "—"}\n${e.definition_short}`,
        e.bodyMarkdown
      )
    );
  }

  const atlas = getEntitiesByType<AtlasEntity>("atlas").sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  for (const e of atlas) {
    out.push(
      entry(
        `${SITE}/atlas/${e.slug}`,
        e.name,
        `Type: atlas · country: ${e.country}${e.region ? `, region: ${e.region}` : ""} · coordinates: ${e.lat}, ${e.lng} · condition: ${e.condition}${e.unesco_status ? ` · UNESCO: ${e.unesco_status}${e.unesco_year ? ` (${e.unesco_year})` : ""}` : ""}`,
        e.bodyMarkdown
      )
    );
  }

  const library = getEntitiesByType<LibraryEntity>("library").sort(
    (a, b) => b.year - a.year
  );
  for (const e of library) {
    out.push(
      entry(
        `${SITE}/library/${e.slug}`,
        e.title,
        `Type: library · year: ${e.year} · publication: ${e.publication} · language: ${e.language}${e.doi ? ` · DOI: ${e.doi}` : ""}${e.url ? ` · URL: ${e.url}` : ""} · paywalled: ${e.paywalled ? "yes" : "no"}`,
        e.bodyMarkdown
      )
    );
  }

  const actors = getEntitiesByType<ActorEntity>("actor").sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  for (const e of actors) {
    out.push(
      entry(
        `${SITE}/actors/${e.slug}`,
        e.full_name ?? e.name,
        `Type: actor · ${e.actor_type}${e.country ? ` · ${e.country}` : ""}${e.active_period ? ` · active ${e.active_period}` : ""}${e.url ? ` · ${e.url}` : ""}`,
        e.bodyMarkdown
      )
    );
  }

  const persons = getEntitiesByType<PersonEntity>("person").sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  for (const e of persons) {
    out.push(
      entry(
        `${SITE}/persons/${e.slug}`,
        e.name,
        `Type: person${e.role ? ` · ${e.role}` : ""}${e.country ? ` · ${e.country}` : ""}`,
        e.bodyMarkdown
      )
    );
  }

  const glossary = getEntitiesByType<GlossaryEntity>("glossary").sort((a, b) =>
    a.term_en.localeCompare(b.term_en)
  );
  for (const e of glossary) {
    const langs = [
      e.term_arabic && `Arabic: ${e.term_arabic}`,
      e.term_french && `French: ${e.term_french}`,
      e.term_tamazight && `Tamazight: ${e.term_tamazight}`,
    ]
      .filter(Boolean)
      .join(" · ");
    out.push(
      entry(
        `${SITE}/glossary/${e.slug}`,
        e.term_en,
        `Type: glossary · category: ${e.category}${langs ? ` · ${langs}` : ""}`,
        e.bodyMarkdown
      )
    );
  }

  const timeline = getEntitiesByType<TimelineEntity>("timeline").sort(
    (a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0)
  );
  for (const e of timeline) {
    out.push(
      entry(
        `${SITE}/timeline`,
        e.title,
        `Type: timeline event · year: ${e.year}${e.month ? `-${String(e.month).padStart(2, "0")}` : ""} · ${e.event_type}`,
        e.bodyMarkdown
      )
    );
  }

  const essays = getEntitiesByType<EssayEntity>("essay").sort((a, b) =>
    b.published_at.localeCompare(a.published_at)
  );
  for (const e of essays) {
    out.push(
      entry(
        `${SITE}/essays/${e.slug}`,
        e.title,
        `Type: essay · published: ${e.published_at}${e.subtitle ? `\nSubtitle: ${e.subtitle}` : ""}\nDek: ${e.dek}`,
        e.bodyMarkdown
      )
    );
  }

  return new Response(out.join(""), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
