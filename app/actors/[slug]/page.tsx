import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EntityHeader from "@/components/entity/EntityHeader";
import EntityBody from "@/components/entity/EntityBody";
import EntityShell from "@/components/entity/EntityShell";
import MetadataPanel from "@/components/entity/MetadataPanel";
import ReferencesPanel from "@/components/entity/ReferencesPanel";
import BacklinksPanel from "@/components/entity/BacklinksPanel";
import EntityLink from "@/components/shared/EntityLink";
import { getEntitiesByType, getEntityBySlug } from "@/lib/graph";
import { actorJsonLd, jsonLdScript } from "@/lib/schema-org";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("actor").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("actor", params.slug);
  if (!e) return { title: "Actor not found" };
  return { title: e.full_name ?? e.name, description: `${e.actor_type}${e.country ? `, ${e.country}` : ""}` };
}

export default function ActorDetail({ params }: Props) {
  const e = getEntityBySlug("actor", params.slug);
  if (!e) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(actorJsonLd(e))}
      />
      <EntityShell
        header={
          <EntityHeader
            type={e.type}
            id={e.id}
            title={e.name}
            subtitle={e.full_name && e.full_name !== e.name ? e.full_name : null}
          />
        }
        body={<EntityBody html={e.bodyHtml} />}
        side={
          <>
            <MetadataPanel
              rows={[
                { label: "Type", value: e.actor_type },
                { label: "Country", value: e.country ?? null },
                { label: "Active", value: e.active_period ?? null },
                {
                  label: "URL",
                  value: e.url ? (
                    <a href={e.url} className="text-ink hover:text-accent break-all" target="_blank" rel="noreferrer">
                      {e.url}
                    </a>
                  ) : null,
                },
                {
                  label: "HQ",
                  value: e.headquartered_at ? <EntityLink id={e.headquartered_at} /> : null,
                },
              ]}
            />
            <ReferencesPanel
              groups={[
                { label: "Key publications", ids: e.key_publications ?? [] },
                { label: "Works on sites", ids: e.works_on_sites ?? [] },
              ]}
            />
            <BacklinksPanel id={e.id} />
          </>
        }
      />
    </>
  );
}
