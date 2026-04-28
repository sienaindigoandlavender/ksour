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

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org";

function url(path: string) {
  return `${SITE.replace(/\/$/, "")}${path}`;
}

export function atlasJsonLd(e: AtlasEntity) {
  return {
    "@context": "https://schema.org",
    "@type": ["Place", "LandmarksOrHistoricalBuildings"],
    name: e.name,
    alternateName: e.alternate_names ?? undefined,
    address: { "@type": "PostalAddress", addressCountry: e.country, addressRegion: e.region },
    geo: { "@type": "GeoCoordinates", latitude: e.lat, longitude: e.lng },
    url: url(`/atlas/${e.slug}`),
  };
}

export function libraryJsonLd(e: LibraryEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    name: e.title,
    headline: e.title,
    datePublished: String(e.year),
    inLanguage: e.language,
    isAccessibleForFree: !e.paywalled,
    identifier: e.doi ?? undefined,
    url: e.url ?? url(`/library/${e.slug}`),
  };
}

export function actorJsonLd(e: ActorEntity) {
  const isGov = e.actor_type === "government-agency";
  return {
    "@context": "https://schema.org",
    "@type": isGov ? "GovernmentOrganization" : "Organization",
    name: e.full_name ?? e.name,
    alternateName: e.full_name && e.full_name !== e.name ? e.name : undefined,
    url: e.url ?? url(`/actors/${e.slug}`),
    foundingLocation: e.country ?? undefined,
  };
}

export function personJsonLd(e: PersonEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: e.name,
    url: url(`/persons/${e.slug}`),
    nationality: e.country ?? undefined,
    jobTitle: e.role ?? undefined,
  };
}

export function glossaryJsonLd(e: GlossaryEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: e.term_en,
    inDefinedTermSet: url("/glossary"),
    url: url(`/glossary/${e.slug}`),
    termCode: e.slug,
  };
}

export function typologyJsonLd(e: TypologyEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: e.name_en,
    description: e.definition_short,
    url: url(`/typology/${e.slug}`),
    termCode: e.slug,
  };
}

export function essayJsonLd(e: EssayEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: e.title,
    description: e.dek,
    datePublished: e.published_at,
    dateModified: e.updated_at ?? e.published_at,
    url: url(`/essays/${e.slug}`),
  };
}

export function timelineJsonLd(e: TimelineEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.month
      ? `${e.year}-${String(e.month).padStart(2, "0")}`
      : String(e.year),
  };
}

export function jsonLdScript(data: object) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
