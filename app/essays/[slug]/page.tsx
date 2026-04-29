import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugs } from "@/lib/graph";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import JsonLd from "@/components/shared/JsonLd";
import { essayJsonLd } from "@/lib/schema-org";
import type { EssayEntity } from "@/lib/types";
import { proseDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllSlugs("essay").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("essay", params.slug) as EssayEntity | null;
  if (!e) return { title: "Not found" };
  const path = `/essays/${e.slug}`;
  return {
    title: e.title,
    description: e.dek,
    alternates: { canonical: path },
    keywords: e.topics,
    authors: [{ name: "Ksour Archive" }],
    openGraph: {
      type: "article",
      url: path,
      title: `${e.title} — Ksour`,
      description: e.dek,
      publishedTime: e.published_at,
      modifiedTime: e.updated_at ?? e.published_at,
      tags: e.topics,
    },
    twitter: {
      card: "summary_large_image",
      title: e.title,
      description: e.dek,
    },
  };
}

export default function EssayDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("essay", params.slug) as EssayEntity | null;
  if (!entity) notFound();

  const metadataFields = [
    { label: "Published", value: proseDate(entity.published_at) },
    entity.updated_at &&
      entity.updated_at !== entity.published_at && {
        label: "Updated",
        value: proseDate(entity.updated_at),
      },
    entity.region_focus?.length && {
      label: "Regions",
      value: entity.region_focus.join(", "),
    },
    entity.topics?.length && { label: "Topics", value: entity.topics.join(", ") },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Sites referenced", ids: entity.referenced_sites ?? [] },
    { label: "Library cited", ids: entity.referenced_library ?? [] },
    { label: "Actors", ids: entity.referenced_actors ?? [] },
  ];

  return (
    <article className="max-w-content mx-auto px-6 py-12">
      <JsonLd data={essayJsonLd(entity)} />
      <div className="max-w-prose mx-auto">
        <EntityHeader
          type="essay"
          id={entity.id}
          title={entity.title}
          subtitle={entity.subtitle}
        />
        {entity.dek ? (
          <p className="font-serif text-2xl text-secondary leading-snug mb-12">
            {entity.dek}
          </p>
        ) : null}
        <EntityBody html={entity.body} />
      </div>
      <div className="max-w-prose mx-auto mt-16">
        <MetadataPanel fields={metadataFields} />
        <ReferencesPanel sections={referenceSections} />
        <BacklinksPanel entityId={entity.id} />
      </div>
    </article>
  );
}
