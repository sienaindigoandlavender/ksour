export type EntityType =
  | "typology"
  | "atlas"
  | "library"
  | "actor"
  | "person"
  | "glossary"
  | "timeline"
  | "essay";

export type EntityID = string;

export type Condition = "intact" | "partial" | "ruin" | "restored" | "unknown";
export type UnescoStatus = "world-heritage" | "tentative" | "national-heritage" | null;
export type Country =
  | "morocco"
  | "tunisia"
  | "algeria"
  | "libya"
  | "mauritania"
  | "mali"
  | "niger";

export interface BaseEntity {
  type: EntityType;
  id: EntityID;
  slug: string;
  body: string;
  bodyMarkdown: string;
}

export interface TypologyEntity extends BaseEntity {
  type: "typology";
  name_en: string;
  name_ar?: string;
  name_french?: string;
  name_tamazight?: string;
  plural_form?: string;
  definition_short: string;
  regions: Country[];
  materials: string[];
  period_start?: string;
  period_end?: string;
  confusion_with?: EntityID[];
  key_examples?: EntityID[];
  sources?: EntityID[];
}

export interface AtlasEntity extends BaseEntity {
  type: "atlas";
  name: string;
  alternate_names?: string[];
  typology: EntityID[];
  country: Country;
  region?: string;
  lat: number;
  lng: number;
  period_built?: string;
  materials?: string[];
  condition: Condition;
  unesco_status?: UnescoStatus;
  unesco_year?: number;
  last_intervention_year?: number;
  documented_by?: EntityID[];
  sources?: EntityID[];
}

export type LibraryPublicationType =
  | "paper"
  | "book"
  | "chapter"
  | "report"
  | "thesis"
  | "article";

export type LibraryLanguage = "en" | "fr" | "es" | "it" | "ar" | "de";

export interface LibraryEntity extends BaseEntity {
  type: "library";
  title: string;
  authors: EntityID[];
  year: number;
  publication: string;
  publication_type: LibraryPublicationType;
  language: LibraryLanguage;
  doi?: string | null;
  url?: string | null;
  paywalled: boolean;
  documents_sites?: EntityID[];
  discusses_typology?: EntityID[];
  mentions_actors?: EntityID[];
  topics?: string[];
}

export type ActorType =
  | "institution"
  | "team"
  | "funder"
  | "government-agency"
  | "ngo"
  | "university";

export interface ActorEntity extends BaseEntity {
  type: "actor";
  name: string;
  full_name?: string;
  actor_type: ActorType;
  country?: Country | null;
  url?: string | null;
  active_period?: string;
  headquartered_at?: EntityID | null;
  key_publications?: EntityID[];
  works_on_sites?: EntityID[];
}

export interface PersonEntity extends BaseEntity {
  type: "person";
  name: string;
  affiliation?: EntityID[];
  role?: string;
  country?: Country | null;
  authored?: EntityID[];
}

export type GlossaryCategory =
  | "material"
  | "technique"
  | "tool"
  | "building-element"
  | "building-type"
  | "actor-role";

export interface GlossaryEntity extends BaseEntity {
  type: "glossary";
  term_en: string;
  term_arabic?: string;
  term_arabic_translit?: string;
  term_tamazight?: string;
  term_tifinagh?: string;
  term_french?: string;
  category: GlossaryCategory;
  related_terms?: EntityID[];
  referenced_in?: EntityID[];
}

export type TimelineEventType =
  | "restoration"
  | "unesco-listing"
  | "publication"
  | "institution-founded"
  | "disaster";

export interface TimelineEntity extends BaseEntity {
  type: "timeline";
  year: number;
  month?: number | null;
  event_type: TimelineEventType;
  title: string;
  sites?: EntityID[];
  actors?: EntityID[];
  library_refs?: EntityID[];
}

export interface EssayEntity extends BaseEntity {
  type: "essay";
  title: string;
  subtitle?: string;
  dek: string;
  region_focus?: Country[];
  topics?: string[];
  referenced_sites?: EntityID[];
  referenced_library?: EntityID[];
  referenced_actors?: EntityID[];
  published_at: string;
  updated_at: string;
}

export type Entity =
  | TypologyEntity
  | AtlasEntity
  | LibraryEntity
  | ActorEntity
  | PersonEntity
  | GlossaryEntity
  | TimelineEntity
  | EssayEntity;

export interface BacklinkRef {
  id: EntityID;
  type: EntityType;
  name: string;
  relation: string;
}

export interface Backlinks {
  [entityId: string]: BacklinkRef[];
}

export interface Graph {
  entities: { [id: string]: Entity };
  backlinks: Backlinks;
}

export interface AtlasPoint {
  id: EntityID;
  name: string;
  lat: number;
  lng: number;
  condition: Condition;
  country: Country;
  typology: EntityID[];
  unesco_status?: UnescoStatus;
}
