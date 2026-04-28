import clsx, { type ClassValue } from "clsx";
import type { EntityType } from "@/lib/types";

export function cn(...args: ClassValue[]) {
  return clsx(...args);
}

const TYPE_PATH: Record<EntityType, string> = {
  typology: "typology",
  atlas: "atlas",
  library: "library",
  actor: "actors",
  person: "persons",
  glossary: "glossary",
  timeline: "timeline",
  essay: "essays",
};

export function pathFor(type: EntityType, slug: string) {
  if (type === "timeline") return "/timeline";
  return `/${TYPE_PATH[type]}/${slug}`;
}

const TYPE_LABEL: Record<EntityType, string> = {
  typology: "Typology",
  atlas: "Atlas",
  library: "Library",
  actor: "Actor",
  person: "Person",
  glossary: "Glossary",
  timeline: "Timeline",
  essay: "Essay",
};

export function labelFor(type: EntityType) {
  return TYPE_LABEL[type];
}

export function proseDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function isoDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toISOString().slice(0, 10);
}

export function groupBy<T, K extends string>(items: T[], key: (item: T) => K) {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out as Record<K, T[]>;
}
