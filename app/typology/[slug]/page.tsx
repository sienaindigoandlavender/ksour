import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import EntityShell from "@/components/entity/EntityShell";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import { getEntitiesByType, getEntityBySlug } from "@/lib/graph";
import { jsonLdScript, typologyJsonLd } from "@/lib/schema-org";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("typology").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("typology", params.slug);
  if (!e) return { title: "Typology not found" };
  return { title: e.name_en, description: e.definition_short };
}

export default function TypologyDetail({ params }: Props) {
  const e = getEntityBySlug("typology", params.slug);
  if (!e) notFound();

  const altNames = [
    e.name_ar ? `${e.name_ar} (Arabic)` : null,
    e.name_french ? `${e.name_french} (French)` : null,
    e.name_tamazight ? `${e.name_tamazight} (Tamazight)` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(typologyJsonLd(e))}
      />
      <EntityShell
        header={
          <EntityHeader
            type={e.type}
            id={e.id}
            title={e.name_en}
            subtitle={e.definition_short}
          />
        }
        body={<EntityBody html={e.bodyHtml} />}
        side={
          <>
            <MetadataPanel
              rows={[
                { label: "Plural", value: e.plural_form ?? null },
                { label: "Other names", value: altNames.length ? altNames.join(", ") : null },
                { label: "Regions", value: e.regions?.join(", ") },
                { label: "Materials", value: e.materials?.join(", ") },
                { label: "Period", value: [e.period_start, e.period_end].filter(Boolean).join(" – ") || null },
              ]}
            />
            <ReferencesPanel
              groups={[
                { label: "Often confused with", ids: e.confusion_with ?? [] },
                { label: "Key examples", ids: e.key_examples ?? [] },
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
