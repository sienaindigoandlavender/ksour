import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import EntityShell from "@/components/entity/EntityShell";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import { getEntitiesByType, getEntityBySlug } from "@/lib/graph";
import { atlasJsonLd, jsonLdScript } from "@/lib/schema-org";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("atlas").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("atlas", params.slug);
  if (!e) return { title: "Site not found" };
  return { title: e.name, description: `${e.region}, ${e.country}` };
}

export default function AtlasDetail({ params }: Props) {
  const e = getEntityBySlug("atlas", params.slug);
  if (!e) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(atlasJsonLd(e))}
      />
      <EntityShell
        header={
          <EntityHeader
            type={e.type}
            id={e.id}
            title={e.name}
            subtitle={e.alternate_names?.join(" · ")}
          />
        }
        body={<EntityBody html={e.bodyHtml} />}
        side={
          <>
            <MetadataPanel
              rows={[
                { label: "Country", value: e.country },
                { label: "Region", value: e.region },
                { label: "Coordinates", value: `${e.lat.toFixed(4)}, ${e.lng.toFixed(4)}` },
                { label: "Period built", value: e.period_built ?? null },
                { label: "Materials", value: e.materials?.join(", ") },
                { label: "Condition", value: e.condition },
                {
                  label: "UNESCO",
                  value: e.unesco_status
                    ? `${e.unesco_status}${e.unesco_year ? ` (${e.unesco_year})` : ""}`
                    : null,
                },
                { label: "Last intervention", value: e.last_intervention_year ?? null },
              ]}
            />
            <ReferencesPanel
              groups={[
                { label: "Typology", ids: e.typology },
                { label: "Documented by", ids: e.documented_by ?? [] },
                { label: "Sources", ids: e.sources ?? [] },
              ]}
            />
            <BacklinksPanel id={e.id} />
          </>
        }
      />
    </>
  );
}
