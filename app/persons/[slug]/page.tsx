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
import { jsonLdScript, personJsonLd } from "@/lib/schema-org";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("person").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("person", params.slug);
  if (!e) return { title: "Person not found" };
  return { title: e.name, description: `Person · ${e.role ?? "researcher"}` };
}

export default function PersonDetail({ params }: Props) {
  const e = getEntityBySlug("person", params.slug);
  if (!e) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(personJsonLd(e))}
      />
      <EntityShell
        header={<EntityHeader type={e.type} id={e.id} title={e.name} />}
        body={<EntityBody html={e.bodyHtml} />}
        side={
          <>
            <MetadataPanel
              rows={[
                { label: "Role", value: e.role ?? null },
                { label: "Country", value: e.country ?? null },
                {
                  label: "Affiliation",
                  value: e.affiliation?.length ? (
                    <ul className="space-y-1">
                      {e.affiliation.map((id) => (
                        <li key={id}>
                          <EntityLink id={id} />
                        </li>
                      ))}
                    </ul>
                  ) : null,
                },
              ]}
            />
            <ReferencesPanel
              groups={[{ label: "Authored", ids: e.authored ?? [] }]}
            />
            <BacklinksPanel id={e.id} />
          </>
        }
      />
    </>
  );
}
