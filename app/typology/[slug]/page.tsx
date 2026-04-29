import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugs } from "@/lib/graph";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import JsonLd from "@/components/shared/JsonLd";
import { typologyJsonLd } from "@/lib/schema-org";
import type { TypologyEntity } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugs("typology").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("typology", params.slug) as TypologyEntity | null;
  if (!e) return { title: "Not found" };
  const path = `/typology/${e.slug}`;
  return {
    title: e.name_en,
    description: e.definition_short,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${e.name_en} — Ksour`,
      description: e.definition_short,
    },
    twitter: { card: "summary", title: e.name_en, description: e.definition_short },
  };
}

export default function TypologyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("typology", params.slug) as TypologyEntity | null;
  if (!entity) notFound();

  const altNames = [
    entity.name_ar ? `${entity.name_ar} (Arabic)` : null,
    entity.name_french ? `${entity.name_french} (French)` : null,
    entity.name_tamazight ? `${entity.name_tamazight} (Tamazight)` : null,
  ].filter(Boolean) as string[];

  const metadataFields = [
    entity.plural_form && { label: "Plural", value: entity.plural_form },
    altNames.length && { label: "Other names", value: altNames.join(", ") },
    entity.regions?.length && { label: "Regions", value: entity.regions.join(", ") },
    entity.materials?.length && { label: "Materials", value: entity.materials.join(", ") },
    (entity.period_start || entity.period_end) && {
      label: "Period",
      value: [entity.period_start, entity.period_end].filter(Boolean).join(" – "),
    },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Often confused with", ids: entity.confusion_with ?? [] },
    { label: "Key examples", ids: entity.key_examples ?? [] },
    { label: "Sources", ids: entity.sources ?? [] },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd data={typologyJsonLd(entity)} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        <div>
          <EntityHeader
            type="typology"
            id={entity.id}
            title={entity.name_en}
            subtitle={entity.definition_short}
          />
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
