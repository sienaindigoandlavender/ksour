import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import AtlasMap from "@/components/atlas/AtlasMap";
import AtlasFilters from "@/components/atlas/AtlasFilters";
import AtlasList from "@/components/atlas/AtlasList";
import { getEntitiesByType } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "Geographic index of documented earthen sites across the Saharan-Maghreb region.",
};

export default function AtlasIndex() {
  const entries = getEntitiesByType("atlas").sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const countries = Array.from(new Set(entries.map((e) => e.country))).sort();
  const conditions = Array.from(new Set(entries.map((e) => e.condition))).sort();

  return (
    <>
      <PageHeader
        eyebrow="Map and list"
        title="Atlas"
        dek="Documented sites with condition, materials, intervention history, and source attribution."
      />
      <AtlasMap token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />
      <div className="mx-auto max-w-page px-6 py-10">
        <AtlasFilters countries={countries} conditions={conditions} />
      </div>
      <div className="mx-auto max-w-page px-6 pb-16">
        <AtlasList entries={entries} />
      </div>
    </>
  );
}
