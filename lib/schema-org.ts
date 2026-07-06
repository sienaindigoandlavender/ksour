import type {
  ActorEntity,
  AtlasEntity,
  EssayEntity,
  GlossaryEntity,
  LibraryEntity,
  TimelineEntity,
  TypologyEntity,
} from "@/lib/types";
import {
  COPYRIGHT_HOLDER,
  COPYRIGHT_NOTICE_BASE,
  LICENSE,
  USAGE_INFO_PATH,
  copyrightYears,
} from "@/lib/license";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ksour.org").replace(/\/$/, "");

function url(path: string) {
  return `${SITE}${path}`;
}

const KSOUR_PUBLISHER = {
  "@type": "Organization",
  name: COPYRIGHT_HOLDER,
  url: SITE,
};

const RIGHTS_PROPERTIES = {
  license: LICENSE.url,
  usageInfo: url(USAGE_INFO_PATH),
  copyrightHolder: KSOUR_PUBLISHER,
  copyrightYear: copyrightYears(),
  copyrightNotice: COPYRIGHT_NOTICE_BASE,
  creditText: COPYRIGHT_HOLDER,
  creator: KSOUR_PUBLISHER,
  publisher: KSOUR_PUBLISHER,
  conditionsOfAccess: `Reuse permitted under ${LICENSE.shortName} with required attribution to ${COPYRIGHT_HOLDER}. See ${url(USAGE_INFO_PATH)}.`,
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COPYRIGHT_HOLDER,
    url: SITE,
    description:
      "A digital synthesis archive of earthen architectural heritage across the Saharan-Maghreb region.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ksour",
    url: SITE,
    inLanguage: "en",
    publisher: KSOUR_PUBLISHER,
    license: LICENSE.url,
    usageInfo: url(USAGE_INFO_PATH),
    copyrightHolder: KSOUR_PUBLISHER,
    copyrightYear: copyrightYears(),
    copyrightNotice: COPYRIGHT_NOTICE_BASE,
    creditText: COPYRIGHT_HOLDER,
  };
}

function firstLine(markdown: string, max = 280): string | undefined {
  const line = markdown.split("\n").find((l) => l.trim());
  if (!line) return undefined;
  const trimmed = line.trim().replace(/^#+\s*/, "");
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

export function atlasJsonLd(e: AtlasEntity) {
  return {
    "@context": "https://schema.org",
    "@type": ["LandmarksOrHistoricalBuildings", "Place"],
    name: e.name,
    alternateName: e.alternate_names,
    description: firstLine(e.bodyMarkdown),
    address: {
      "@type": "PostalAddress",
      addressCountry: e.country,
      addressRegion: e.region,
    },
    geo: { "@type": "GeoCoordinates", latitude: e.lat, longitude: e.lng },
    url: url(`/atlas/${e.slug}`),
    isAccessibleForFree: true,
    ...RIGHTS_PROPERTIES,
  };
}

export function libraryJsonLd(e: LibraryEntity) {
  const type =
    e.publication_type === "book"
      ? "Book"
      : e.publication_type === "report"
      ? "Report"
      : "ScholarlyArticle";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: e.title,
    headline: type === "ScholarlyArticle" ? e.title : undefined,
    datePublished: String(e.year),
    inLanguage: e.language,
    isAccessibleForFree: !e.paywalled,
    identifier: e.doi ? `doi:${e.doi}` : undefined,
    url: e.url ?? url(`/library/${e.slug}`),
    publisher: e.publication
      ? { "@type": "Organization", name: e.publication }
      : undefined,
    keywords: e.topics?.join(", "),
    license: LICENSE.url,
    usageInfo: url(USAGE_INFO_PATH),
    copyrightHolder: KSOUR_PUBLISHER,
    copyrightYear: copyrightYears(),
    copyrightNotice: `Bibliographic synthesis © ${copyrightYears()} ${COPYRIGHT_HOLDER}, licensed ${LICENSE.shortName}. The cited work itself is the property of its respective rights holders.`,
    creditText: COPYRIGHT_HOLDER,
  };
}

export function actorJsonLd(e: ActorEntity) {
  const type =
    e.actor_type === "government-agency"
      ? "GovernmentOrganization"
      : e.actor_type === "ngo"
      ? "NGO"
      : e.actor_type === "university"
      ? "EducationalOrganization"
      : "Organization";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: e.full_name ?? e.name,
    alternateName: e.full_name && e.full_name !== e.name ? e.name : undefined,
    url: e.url ?? url(`/actors/${e.slug}`),
    foundingLocation: e.country ?? undefined,
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
    description: e.bodyMarkdown.split("\n").find((l) => l.trim())?.slice(0, 280),
    ...RIGHTS_PROPERTIES,
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
    inDefinedTermSet: url("/typology"),
    ...RIGHTS_PROPERTIES,
  };
}

export function essayJsonLd(e: EssayEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: e.title,
    alternativeHeadline: e.subtitle ?? undefined,
    description: e.dek,
    datePublished: e.published_at,
    dateModified: e.updated_at ?? e.published_at,
    inLanguage: "en",
    url: url(`/essays/${e.slug}`),
    publisher: KSOUR_PUBLISHER,
    author: KSOUR_PUBLISHER,
    keywords: e.topics?.join(", "),
    isAccessibleForFree: true,
    articleBody: e.bodyMarkdown,
    license: LICENSE.url,
    usageInfo: url(USAGE_INFO_PATH),
    copyrightHolder: KSOUR_PUBLISHER,
    copyrightYear: copyrightYears(),
    copyrightNotice: COPYRIGHT_NOTICE_BASE,
    creditText: COPYRIGHT_HOLDER,
    creator: KSOUR_PUBLISHER,
    conditionsOfAccess: RIGHTS_PROPERTIES.conditionsOfAccess,
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

export function collectionJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  items?: { name: string; url: string }[];
}) {
  const base = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: url(opts.path),
    isPartOf: { "@type": "WebSite", name: "Ksour", url: SITE },
  };
  if (!opts.items) return base;
  return {
    ...base,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: it.url.startsWith("http") ? it.url : url(it.url),
        name: it.name,
      })),
    },
  };
}

export function jsonLdScript(data: object) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
