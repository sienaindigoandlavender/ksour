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

export type Region =
  | "morocco"
  | "tunisia"
  | "libya"
  | "algeria"
  | "mauritania"
  | "mali"
  | "niger";

export type Condition = "intact" | "partial" | "ruin" | "restored" | "unknown";
export type UnescoStatus = "world-heritage" | "tentative" | "national-heritage" | null;

export type LibraryPublicationType =
  | "paper"
  | "book"
  | "chapter"
  | "report"
  | "thesis"
  | "article";

export type ActorType =
  | "institution"
  | "team"
  | "funder"
  | "government-agency"
  | "research-group";

export type GlossaryCategory =
  | "material"
  | "technique"
  | "tool"
  | "building-element"
  | "building-type"
  | "actor-role";

export type TimelineEventType =
  | "restoration"
  | "unesco-listing"
  | "publication"
  | "institution-founded"
  | "disaster";

export interface BaseEntity {
  type: EntityType;
  id: EntityID;
  slug: string;
  body: string;
  bodyHtml: string;
  sourcePath: string;
}

export interface TypologyEntity extends BaseEntity {
  type: "typology";
  name_en: string;
  name_ar?: string | null;
  name_french?: string | null;
  name_tamazight?: string | null;
  plural_form?: string | null;
  definition_short: string;
  regions: Region[];
  materials: string[];
  period_start?: string | null;
  period_end?: string | null;
  confusion_with?: EntityID[];
  key_examples?: EntityID[];
  sources?: EntityID[];
}

export interface AtlasEntity extends BaseEntity {
  type: "atlas";
  name: string;
  alternate_names?: string[];
  typology: EntityID[];
  country: Region;
  region: string;
  lat: number;
  lng: number;
  period_built?: string | null;
  materials: string[];
  condition: Condition;
  unesco_status?: UnescoStatus;
  unesco_year?: number | null;
  last_intervention_year?: number | null;
  documented_by?: EntityID[];
  sources?: EntityID[];
}

export interface LibraryEntity extends BaseEntity {
  type: "library";
  title: string;
  authors: EntityID[];
  year: number;
  publication: string;
  publication_type: LibraryPublicationType;
  language: string;
  doi?: string | null;
  url?: string | null;
  paywalled: boolean;
  documents_sites?: EntityID[];
  discusses_typology?: EntityID[];
  mentions_actors?: EntityID[];
  topics?: string[];
}

export interface ActorEntity extends BaseEntity {
  type: "actor";
  name: string;
  full_name?: string;
  actor_type: ActorType;
  country?: Region | null;
  url?: string | null;
  active_period?: string | null;
  headquartered_at?: EntityID | null;
  key_publications?: EntityID[];
  works_on_sites?: EntityID[];
}

export interface PersonEntity extends BaseEntity {
  type: "person";
  name: string;
  affiliation?: EntityID[];
  role?: string;
  country?: Region | null;
  authored?: EntityID[];
}

export interface GlossaryEntity extends BaseEntity {
  type: "glossary";
  term_en: string;
  term_arabic?: string | null;
  term_arabic_translit?: string | null;
  term_tamazight?: string | null;
  term_tifinagh?: string | null;
  term_french?: string | null;
  category: GlossaryCategory;
  related_terms?: EntityID[];
  referenced_in?: EntityID[];
}

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
  subtitle?: string | null;
  dek: string;
  region_focus?: Region[];
  topics?: string[];
  referenced_sites?: EntityID[];
  referenced_library?: EntityID[];
  referenced_actors?: EntityID[];
  published_at: string;
  updated_at?: string;
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
  relation: string;
}

export interface Backlinks {
  [entityId: string]: {
    referencedBy: BacklinkRef[];
  };
}

export interface Graph {
  entities: Record<EntityID, Entity>;
  byType: Record<EntityType, EntityID[]>;
  backlinks: Backlinks;
  generatedAt: string;
}

export interface AtlasPoint {
  id: EntityID;
  name: string;
  lat: number;
  lng: number;
  condition: Condition;
  country: Region;
  typology: EntityID[];
  unesco_status?: UnescoStatus;
}
