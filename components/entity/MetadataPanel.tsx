import type { ReactNode } from "react";

export interface MetadataRow {
  label: string;
  value: ReactNode;
}

interface Props {
  rows: MetadataRow[];
}

export default function MetadataPanel({ rows }: Props) {
  const visible = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");
  if (visible.length === 0) return null;
  return (
    <section>
      <p className="meta mb-4">Metadata</p>
      <dl className="space-y-3 text-sm">
        {visible.map((row) => (
          <div key={row.label} className="grid grid-cols-[7rem_1fr] gap-3">
            <dt className="meta normal-case tracking-wider text-tertiary pt-px">
              {row.label}
            </dt>
            <dd className="text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
