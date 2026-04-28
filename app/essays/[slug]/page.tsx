import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EntityShell from "@/components/entity/EntityShell";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import { getEntitiesByType, getEntityBySlug } from "@/lib/graph";
import { essayJsonLd, jsonLdScript } from "@/lib/schema-org";
import { proseDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("essay").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("essay", params.slug);
  if (!e) return { title: "Essay not found" };
  return { title: e.title, description: e.dek };
}

export default function EssayDetail({ params }: Props) {
  const e = getEntityBySlug("essay", params.slug);
  if (!e) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(essayJsonLd(e))}
      />
      <EntityShell
        header={
          <div>
            <p className="meta">Essay · {proseDate(e.published_at)}</p>
            <EntityHeader type={e.type} id={e.id} title={e.title} subtitle={e.subtitle ?? null} />
            <p className="mt-6 text-lg text-secondary leading-relaxed max-w-2xl">{e.dek}</p>
          </div>
        }
        body={
          <div className="max-w-prose">
            <EntityBody html={e.bodyHtml} />
          </div>
        }
        side={
          <>
            <ReferencesPanel
              groups={[
                { label: "Sites referenced", ids: e.referenced_sites ?? [] },
                { label: "Library cited", ids: e.referenced_library ?? [] },
                { label: "Actors", ids: e.referenced_actors ?? [] },
              ]}
            />
            <BacklinksPanel id={e.id} />
          </>
        }
      />
    </>
  );
}
