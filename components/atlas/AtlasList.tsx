"use client";

import Link from "next/link";
import type { AtlasEntity, Condition } from "@/lib/types";

const conditionLabels: Record<Condition, string> = {
  intact: "Intact",
  restored: "Restored",
  partial: "Partial",
  ruin: "Ruin",
  unknown: "Unknown",
};

const conditionColors: Record<Condition, string> = {
  intact: "#16a34a",
  restored: "#2563eb",
  partial: "#ca8a04",
  ruin: "#dc2626",
  unknown: "#737373",
};

interface Props {
  sites: AtlasEntity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function AtlasList({ sites, selectedId, onSelect }: Props) {
  if (sites.length === 0) {
    return (
      <div className="p-6 text-meta text-tertiary">
        No sites match the current filters.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {sites.map((site) => {
        const isSelected = site.id === selectedId;
        return (
          <li
            key={site.id}
            className={`group cursor-pointer transition-colors ${
              isSelected ? "bg-codebg" : "hover:bg-codebg"
            }`}
            onMouseEnter={() => onSelect(site.id)}
            onClick={() => onSelect(site.id)}
          >
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <span
                  className="block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: conditionColors[site.condition] }}
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/atlas/${site.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-serif text-lg text-ink group-hover:text-accent transition-colors block leading-snug"
                  >
                    {site.name}
                  </Link>
                  <p className="font-mono text-meta text-tertiary uppercase tracking-wide mt-1">
                    {site.country}
                    {site.region ? ` · ${site.region}` : ""}
                    {" · "}
                    {conditionLabels[site.condition]}
                    {site.unesco_status === "world-heritage" && " · UNESCO"}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
