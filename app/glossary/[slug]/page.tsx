import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import EntityShell from "@/components/entity/EntityShell";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import { getEntitiesByType, getEntityBySlug } from "@/lib/graph";
import { glossaryJsonLd, jsonLdScript } from "@/lib/schema-org";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("glossary").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("glossary", params.slug);
  if (!e) return { title: "Term not found" };
  return { title: e.term_en, description: `${e.category}` };
}

export default function GlossaryDetail({ params }: Props) {
  const e = getEntityBySlug("glossary", params.slug);
  if (!e) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(glossaryJsonLd(e))}
      />
      <EntityShell
        header={<EntityHeader type={e.type} id={e.id} title={e.term_en} />}
        body={<EntityBody html={e.bodyHtml} />}
        side={
          <>
            <MetadataPanel
              rows={[
                { label: "Category", value: e.category },
                {
                  label: "Arabic",
                  value: e.term_arabic
                    ? `${e.term_arabic}${e.term_arabic_translit ? ` (${e.term_arabic_translit})` : ""}`
                    : null,
                },
                { label: "French", value: e.term_french ?? null },
                {
                  label: "Tamazight",
                  value: e.term_tamazight
                    ? `${e.term_tifinagh ? `${e.term_tifinagh} ` : ""}${e.term_tamazight}`
                    : e.term_tifinagh ?? null,
                },
              ]}
            />
            <ReferencesPanel
              groups={[
                { label: "Related terms", ids: e.related_terms ?? [] },
                { label: "Referenced in", ids: e.referenced_in ?? [] },
              ]}
            />
            <BacklinksPanel id={e.id} />
          </>
        }
      />
    </>
  );
}
