"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { AtlasEntity } from "@/lib/types";
import AtlasFilters, {
  type AtlasFilterState,
} from "@/components/atlas/AtlasFilters";
import AtlasList from "@/components/atlas/AtlasList";
import AtlasDetailPanel from "@/components/atlas/AtlasDetailPanel";

const AtlasMap = dynamic(() => import("@/components/atlas/AtlasMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-codebg">
      <p className="font-mono text-meta text-tertiary">Loading map…</p>
    </div>
  ),
});

interface Props {
  sites: AtlasEntity[];
}

export default function AtlasExplorer({ sites }: Props) {
  const [filters, setFilters] = useState<AtlasFilterState>({
    country: "all",
    condition: "all",
    unesco: "all",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleSites = useMemo(() => {
    return sites.filter((site) => {
      if (filters.country !== "all" && site.country !== filters.country) return false;
      if (filters.condition !== "all" && site.condition !== filters.condition)
        return false;
      if (filters.unesco !== "all") {
        if (filters.unesco === "none" && site.unesco_status) return false;
        if (filters.unesco !== "none" && site.unesco_status !== filters.unesco)
          return false;
      }
      return true;
    });
  }, [filters, sites]);

  const selectedSite = selectedId
    ? sites.find((s) => s.id === selectedId) ?? null
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
      <header className="border-b border-border px-6 py-6">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-2">
          Atlas
        </p>
        <h1 className="font-serif text-3xl text-ink">Documented Sites</h1>
      </header>

      <AtlasFilters
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setSelectedId(null);
        }}
        counts={{ total: sites.length, visible: visibleSites.length }}
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="md:w-2/3 relative border-b md:border-b-0 md:border-r border-border min-h-[400px]">
          <AtlasMap
            sites={visibleSites}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <AtlasDetailPanel
            site={selectedSite}
            onClose={() => setSelectedId(null)}
          />
        </div>
        <div className="md:w-1/3 overflow-y-auto bg-white">
          <AtlasList
            sites={visibleSites}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
}
