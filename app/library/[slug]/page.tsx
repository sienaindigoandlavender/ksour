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
import { jsonLdScript, libraryJsonLd } from "@/lib/schema-org";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getEntitiesByType("library").map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const e = getEntityBySlug("library", params.slug);
  if (!e) return { title: "Library entry not found" };
  return { title: e.title, description: `${e.publication}, ${e.year}` };
}

export default function LibraryDetail({ params }: Props) {
  const e = getEntityBySlug("library", params.slug);
  if (!e) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(libraryJsonLd(e))}
      />
      <EntityShell
        header={<EntityHeader type={e.type} id={e.id} title={e.title} />}
        body={<EntityBody html={e.bodyHtml} />}
        side={
          <>
            <MetadataPanel
              rows={[
                { label: "Year", value: e.year },
                { label: "Publication", value: e.publication },
                { label: "Type", value: e.publication_type },
                { label: "Language", value: e.language },
                { label: "DOI", value: e.doi ?? null },
                {
                  label: "URL",
                  value: e.url ? (
                    <a href={e.url} className="text-ink hover:text-accent break-all" target="_blank" rel="noreferrer">
                      {e.url}
                    </a>
                  ) : null,
                },
                { label: "Paywalled", value: e.paywalled ? "Yes" : "No" },
                {
                  label: "Authors",
                  value: e.authors?.length ? (
                    <ul className="space-y-1">
                      {e.authors.map((id) => (
                        <li key={id}>
                          <EntityLink id={id} />
                        </li>
                      ))}
                    </ul>
                  ) : null,
                },
                {
                  label: "Topics",
                  value: e.topics?.length ? e.topics.join(", ") : null,
                },
              ]}
            />
            <ReferencesPanel
              groups={[
                { label: "Documents sites", ids: e.documents_sites ?? [] },
                { label: "Discusses typology", ids: e.discusses_typology ?? [] },
                { label: "Mentions actors", ids: e.mentions_actors ?? [] },
              ]}
            />
            <BacklinksPanel id={e.id} />
          </>
        }
      />
    </>
  );
}
