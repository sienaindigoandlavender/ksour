"use client";

import type { Country, Condition } from "@/lib/types";

export interface AtlasFilterState {
  country: Country | "all";
  condition: Condition | "all";
  unesco: "all" | "world-heritage" | "tentative" | "national-heritage" | "none";
}

interface Props {
  filters: AtlasFilterState;
  onChange: (filters: AtlasFilterState) => void;
  counts: {
    total: number;
    visible: number;
  };
}

const countries: { value: Country | "all"; label: string }[] = [
  { value: "all", label: "All countries" },
  { value: "morocco", label: "Morocco" },
  { value: "mauritania", label: "Mauritania" },
  { value: "algeria", label: "Algeria" },
  { value: "tunisia", label: "Tunisia" },
  { value: "libya", label: "Libya" },
  { value: "mali", label: "Mali" },
  { value: "niger", label: "Niger" },
];

const conditions: { value: Condition | "all"; label: string }[] = [
  { value: "all", label: "Any condition" },
  { value: "intact", label: "Intact" },
  { value: "restored", label: "Restored" },
  { value: "partial", label: "Partial" },
  { value: "ruin", label: "Ruin" },
  { value: "unknown", label: "Unknown" },
];

const unescoOptions = [
  { value: "all", label: "Any UNESCO status" },
  { value: "world-heritage", label: "World Heritage" },
  { value: "tentative", label: "Tentative list" },
  { value: "national-heritage", label: "National heritage" },
  { value: "none", label: "No designation" },
] as const;

export default function AtlasFilters({ filters, onChange, counts }: Props) {
  return (
    <div className="border-b border-border bg-white">
      <div className="px-6 py-4 flex flex-wrap items-center gap-4 text-sm">
        <select
          value={filters.country}
          onChange={(e) =>
            onChange({ ...filters, country: e.target.value as Country | "all" })
          }
          className="border border-border bg-white px-3 py-2 font-mono text-meta uppercase tracking-wide text-ink hover:border-accent focus:outline-none focus:border-accent"
        >
          {countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={filters.condition}
          onChange={(e) =>
            onChange({
              ...filters,
              condition: e.target.value as Condition | "all",
            })
          }
          className="border border-border bg-white px-3 py-2 font-mono text-meta uppercase tracking-wide text-ink hover:border-accent focus:outline-none focus:border-accent"
        >
          {conditions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={filters.unesco}
          onChange={(e) =>
            onChange({
              ...filters,
              unesco: e.target.value as AtlasFilterState["unesco"],
            })
          }
          className="border border-border bg-white px-3 py-2 font-mono text-meta uppercase tracking-wide text-ink hover:border-accent focus:outline-none focus:border-accent"
        >
          {unescoOptions.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        <p className="font-mono text-meta text-tertiary">
          {counts.visible} of {counts.total} sites
        </p>
      </div>
    </div>
  );
}
