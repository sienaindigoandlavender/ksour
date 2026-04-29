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
import { personJsonLd } from "@/lib/schema-org";
import type { PersonEntity } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugs("person").map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getEntityBySlug("person", params.slug) as PersonEntity | null;
  if (!e) return { title: "Not found" };
  const desc = e.role ?? "Researcher";
  const path = `/persons/${e.slug}`;
  return {
    title: e.name,
    description: desc,
    alternates: { canonical: path },
    openGraph: { type: "profile", url: path, title: `${e.name} — Ksour`, description: desc },
    twitter: { card: "summary", title: e.name, description: desc },
  };
}

export default function PersonDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entity = getEntityBySlug("person", params.slug) as PersonEntity | null;
  if (!entity) notFound();

  const affiliations = (entity.affiliation ?? []).map((id) => getEntity(id)).filter(Boolean);

  const metadataFields = [
    entity.role && { label: "Role", value: entity.role },
    entity.country && { label: "Country", value: entity.country },
    affiliations.length && {
      label: "Affiliation",
      value: (
        <ul className="space-y-1">
          {affiliations.map((a) => (
            <li key={a!.id}>
              <EntityLink entity={a!} />
            </li>
          ))}
        </ul>
      ),
    },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const referenceSections = [{ label: "Authored", ids: entity.authored ?? [] }];

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <JsonLd data={personJsonLd(entity)} />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        <div>
          <EntityHeader type="person" id={entity.id} title={entity.name} />
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
