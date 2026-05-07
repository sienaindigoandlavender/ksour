import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugs } from "@/lib/graph";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import JsonLd from "@/components/shared/JsonLd";
import { libraryJsonLd } from "@/lib/schema-org";
import type { LibraryEntity } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugs("library").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("library", params.slug) as LibraryEntity | null;
  if (!e) return { title: "Not found" };
  const desc = `${e.publication}, ${e.year}`;
  const path = `/library/${e.slug}`;
  return {
    title: e.title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${e.title} — Ksour`,
      description: desc,
    },
    twitter: { card: "summary", title: e.title, description: desc },
  };
}

export default function LibraryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("library", params.slug) as LibraryEntity | null;
  if (!entity) notFound();

  const metadataFields = [
    { label: "Year", value: String(entity.year) },
    { label: "Publication", value: entity.publication },
    { label: "Type", value: entity.publication_type },
    { label: "Language", value: entity.language },
    entity.doi && { label: "DOI", value: entity.doi },
    entity.url && {
      label: "URL",
      value: (
        <a
          href={entity.url}
          target="_blank"
          rel="noreferrer"
          className="text-ink hover:text-accent border-b border-border hover:border-accent transition-colors break-all"
        >
          {entity.url}
        </a>
      ),
    },
    { label: "Paywalled", value: entity.paywalled ? "Yes" : "No" },
    entity.topics?.length && { label: "Topics", value: entity.topics.join(", ") },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Documents sites", ids: entity.documents_sites ?? [] },
    { label: "Discusses typology", ids: entity.discusses_typology ?? [] },
    { label: "Mentions actors", ids: entity.mentions_actors ?? [] },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd data={libraryJsonLd(entity)} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        <div>
          <EntityHeader type="library" id={entity.id} title={entity.title} />
          <EntityBody html={entity.body} />
        </div>
        <aside>
          <MetadataPanel fields={metadataFields} />
          <ReferencesPanel sections={referenceSections} />
          <BacklinksPanel entityId={entity.id} />
        </aside>
      </div>
    </div>
  );
}
