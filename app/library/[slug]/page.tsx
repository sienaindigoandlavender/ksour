import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugs, getEntity } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import type { LibraryEntity } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugs("library").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("library", params.slug) as LibraryEntity | null;
  if (!e) return { title: "Not found" };
  return { title: e.title, description: `${e.publication}, ${e.year}` };
}

export default function LibraryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("library", params.slug) as LibraryEntity | null;
  if (!entity) notFound();

  const authorsList = (entity.authors ?? [])
    .map((id) => getEntity(id))
    .filter(Boolean);

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
    authorsList.length && {
      label: "Authors",
      value: (
        <ul className="space-y-1">
          {authorsList.map((p) => (
            <li key={p!.id}>
              <EntityLink entity={p!} />
            </li>
          ))}
        </ul>
      ),
    },
    entity.topics?.length && { label: "Topics", value: entity.topics.join(", ") },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Documents sites", ids: entity.documents_sites ?? [] },
    { label: "Discusses typology", ids: entity.discusses_typology ?? [] },
    { label: "Mentions actors", ids: entity.mentions_actors ?? [] },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
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
