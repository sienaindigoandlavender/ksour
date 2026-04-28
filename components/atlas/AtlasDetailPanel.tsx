"use client";

import Link from "next/link";
import type { AtlasEntity } from "@/lib/types";

interface Props {
  site: AtlasEntity | null;
  onClose: () => void;
}

export default function AtlasDetailPanel({ site, onClose }: Props) {
  if (!site) return null;

  return (
    <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 bg-white border border-border shadow-lg z-10 max-h-[calc(100%-2rem)] overflow-y-auto">
      <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-1">
            {site.country}
            {site.region ? ` · ${site.region}` : ""}
          </p>
          <h3 className="font-serif text-xl text-ink leading-tight">
            {site.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-tertiary hover:text-accent text-lg leading-none flex-shrink-0"
        >
          ×
        </button>
      </div>
      <div className="px-5 py-4 space-y-2 text-sm">
        {site.period_built ? (
          <div className="flex justify-between gap-3">
            <span className="text-tertiary">Period</span>
            <span className="text-ink">{site.period_built}</span>
          </div>
        ) : null}
        {site.materials && site.materials.length > 0 ? (
          <div className="flex justify-between gap-3">
            <span className="text-tertiary">Materials</span>
            <span className="text-ink text-right">
              {site.materials.join(", ")}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <span className="text-tertiary">Condition</span>
          <span className="text-ink capitalize">{site.condition}</span>
        </div>
        {site.unesco_status ? (
          <div className="flex justify-between gap-3">
            <span className="text-tertiary">UNESCO</span>
            <span className="text-ink">
              {site.unesco_status}
              {site.unesco_year ? ` · ${site.unesco_year}` : ""}
            </span>
          </div>
        ) : null}
      </div>
      <div className="px-5 py-4 border-t border-border">
        <Link
          href={`/atlas/${site.slug}`}
          className="font-mono text-meta uppercase tracking-wide text-accent hover:underline"
        >
          View full entry →
        </Link>
      </div>
    </div>
  );
}
