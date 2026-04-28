import type { ReactNode } from "react";

interface MetadataField {
  label: string;
  value: ReactNode;
}

interface Props {
  fields: MetadataField[];
}

export default function MetadataPanel({ fields }: Props) {
  if (!fields.length) return null;

  return (
    <div className="border-t border-border pt-6">
      <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
        Metadata
      </h2>
      <dl className="space-y-3 text-sm">
        {fields.map((field, i) => (
          <div key={i} className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-tertiary">{field.label}</dt>
            <dd className="text-ink">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
