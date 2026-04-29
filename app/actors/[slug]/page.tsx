import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugs, getEntity } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import JsonLd from "@/components/shared/JsonLd";
import { actorJsonLd } from "@/lib/schema-org";
import type { ActorEntity } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugs("actor").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("actor", params.slug) as ActorEntity | null;
  if (!e) return { title: "Not found" };
  const title = e.full_name ?? e.name;
  const desc = `${e.actor_type}${e.country ? `, ${e.country}` : ""}`;
  const path = `/actors/${e.slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { type: "profile", url: path, title: `${title} — Ksour`, description: desc },
    twitter: { card: "summary", title, description: desc },
  };
}

export default function ActorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("actor", params.slug) as ActorEntity | null;
  if (!entity) notFound();

  const hq = entity.headquartered_at ? getEntity(entity.headquartered_at) : null;

  const metadataFields = [
    { label: "Type", value: entity.actor_type },
    entity.country && { label: "Country", value: entity.country },
    entity.active_period && { label: "Active", value: entity.active_period },
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
    hq && {
      label: "HQ",
      value: <EntityLink entity={hq} />,
    },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Key publications", ids: entity.key_publications ?? [] },
    { label: "Works on sites", ids: entity.works_on_sites ?? [] },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd data={actorJsonLd(entity)} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        <div>
          <EntityHeader
            type="actor"
            id={entity.id}
            title={entity.name}
            subtitle={entity.full_name && entity.full_name !== entity.name ? entity.full_name : undefined}
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
