import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugs } from "@/lib/graph";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import type { GlossaryEntity } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugs("glossary").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("glossary", params.slug) as GlossaryEntity | null;
  if (!e) return { title: "Not found" };
  return { title: e.term_en, description: `${e.category}` };
}

export default function GlossaryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("glossary", params.slug) as GlossaryEntity | null;
  if (!entity) notFound();

  const tamazight = entity.term_tifinagh
    ? `${entity.term_tifinagh}${entity.term_tamazight ? ` (${entity.term_tamazight})` : ""}`
    : entity.term_tamazight ?? null;

  const metadataFields = [
    { label: "Category", value: entity.category },
    entity.term_arabic && {
      label: "Arabic",
      value: `${entity.term_arabic}${
        entity.term_arabic_translit ? ` (${entity.term_arabic_translit})` : ""
      }`,
    },
    entity.term_french && { label: "French", value: entity.term_french },
    tamazight && { label: "Tamazight", value: tamazight },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Related terms", ids: entity.related_terms ?? [] },
    { label: "Referenced in", ids: entity.referenced_in ?? [] },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        <div>
          <EntityHeader type="glossary" id={entity.id} title={entity.term_en} />
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
