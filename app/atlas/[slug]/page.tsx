import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getEntityBySlug, getAllSlugs } from "@/lib/graph";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import type { AtlasEntity } from "@/lib/types";

const AtlasInsetMap = dynamic(
  () => import("@/components/atlas/AtlasInsetMap"),
  { ssr: false }
);

export function generateStaticParams() {
  return getAllSlugs("atlas").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("atlas", params.slug) as AtlasEntity | null;
  if (!e) return { title: "Not found" };
  return { title: e.name, description: [e.region, e.country].filter(Boolean).join(", ") };
}

export default function AtlasDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("atlas", params.slug) as AtlasEntity | null;
  if (!entity) notFound();

  const metadataFields = [
    { label: "Country", value: entity.country },
    entity.region && { label: "Region", value: entity.region },
    entity.period_built && { label: "Period", value: entity.period_built },
    entity.materials?.length && {
      label: "Materials",
      value: entity.materials.join(", "),
    },
    { label: "Condition", value: entity.condition },
    entity.unesco_status && {
      label: "UNESCO",
      value: `${entity.unesco_status}${
        entity.unesco_year ? ` (${entity.unesco_year})` : ""
      }`,
    },
    entity.last_intervention_year && {
      label: "Last work",
      value: String(entity.last_intervention_year),
    },
    {
      label: "Coordinates",
      value: `${entity.lat.toFixed(4)}, ${entity.lng.toFixed(4)}`,
    },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [
    { label: "Type of structure", ids: entity.typology },
    { label: "Documented by", ids: entity.documented_by ?? [] },
    { label: "Sources", ids: entity.sources ?? [] },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="mb-8">
        <AtlasInsetMap lat={entity.lat} lng={entity.lng} name={entity.name} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        <div>
          <EntityHeader
            type="atlas"
            id={entity.id}
            title={entity.name}
            subtitle={entity.alternate_names?.join(" · ")}
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
