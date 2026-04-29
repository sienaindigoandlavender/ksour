import { getEntitiesByType } from "./graph";
import type {
  ActorEntity,
  AtlasEntity,
  EssayEntity,
  EntityType,
  GlossaryEntity,
  LibraryEntity,
  PersonEntity,
  TimelineEntity,
  TypologyEntity,
} from "./types";

export interface SearchItem {
  id: string;
  type: EntityType;
  name: string;
  url: string;
  detail?: string;
  keywords: string[];
}

function clean(values: (string | number | null | undefined)[]): string[] {
  const out: string[] = [];
  for (const v of values) {
    if (v == null || v === "") continue;
    out.push(String(v).toLowerCase());
  }
  return Array.from(new Set(out));
}

export function getSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const e of getEntitiesByType<TypologyEntity>("typology")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.name_en,
      url: `/typology/${e.slug}`,
      detail: e.definition_short,
      keywords: clean([
        e.name_en,
        e.name_ar,
        e.name_french,
        e.name_tamazight,
        e.plural_form,
      ]),
    });
  }

  for (const e of getEntitiesByType<AtlasEntity>("atlas")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.name,
      url: `/atlas/${e.slug}`,
      detail: [e.region, e.country].filter(Boolean).join(", "),
      keywords: clean([e.name, ...(e.alternate_names ?? []), e.country, e.region]),
    });
  }

  for (const e of getEntitiesByType<LibraryEntity>("library")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.title,
      url: `/library/${e.slug}`,
      detail: `${e.publication} · ${e.year}`,
      keywords: clean([
        e.title,
        e.publication,
        String(e.year),
        ...(e.topics ?? []),
      ]),
    });
  }

  for (const e of getEntitiesByType<ActorEntity>("actor")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.full_name ?? e.name,
      url: `/actors/${e.slug}`,
      detail: [e.actor_type, e.country].filter(Boolean).join(" · "),
      keywords: clean([e.name, e.full_name, e.country]),
    });
  }

  for (const e of getEntitiesByType<PersonEntity>("person")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.name,
      url: `/persons/${e.slug}`,
      detail: e.role,
      keywords: clean([e.name, e.role, e.country]),
    });
  }

  for (const e of getEntitiesByType<GlossaryEntity>("glossary")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.term_en,
      url: `/glossary/${e.slug}`,
      detail: e.category,
      keywords: clean([
        e.term_en,
        e.term_arabic,
        e.term_arabic_translit,
        e.term_tamazight,
        e.term_tifinagh,
        e.term_french,
      ]),
    });
  }

  for (const e of getEntitiesByType<EssayEntity>("essay")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.title,
      url: `/essays/${e.slug}`,
      detail: e.subtitle ?? e.dek,
      keywords: clean([e.title, e.subtitle, ...(e.topics ?? [])]),
    });
  }

  for (const e of getEntitiesByType<TimelineEntity>("timeline")) {
    items.push({
      id: e.id,
      type: e.type,
      name: e.title,
      url: "/timeline",
      detail: `${e.year} · ${e.event_type}`,
      keywords: clean([e.title, String(e.year), e.event_type]),
    });
  }

  return items;
}
