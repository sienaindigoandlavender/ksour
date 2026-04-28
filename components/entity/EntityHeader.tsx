import type { EntityType } from "@/lib/types";

interface Props {
  type: EntityType;
  id: string;
  title: string;
  subtitle?: string;
}

const typeLabels: Record<EntityType, string> = {
  typology: "Building type",
  atlas: "Site",
  library: "Source",
  actor: "Actor",
  person: "Person",
  glossary: "Term",
  timeline: "Event",
  essay: "Essay",
};

export default function EntityHeader({ type, id, title, subtitle }: Props) {
  return (
    <header className="mb-12 pb-8 border-b border-border">
      <div className="font-mono text-meta text-tertiary mb-4 flex gap-4 uppercase tracking-wide">
        <span>{typeLabels[type]}</span>
        <span className="text-border">·</span>
        <span>{id}</span>
      </div>
      <h1 className="font-serif text-5xl leading-tight text-ink mb-3">
        {title}
      </h1>
      {subtitle ? (
        <p className="font-serif text-xl text-secondary leading-snug max-w-prose">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
