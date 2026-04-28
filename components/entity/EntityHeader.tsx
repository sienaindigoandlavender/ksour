import TypeBadge from "@/components/shared/TypeBadge";
import type { EntityType } from "@/lib/types";

interface Props {
  type: EntityType;
  id: string;
  title: string;
  subtitle?: string | null;
}

export default function EntityHeader({ type, id, title, subtitle }: Props) {
  return (
    <header>
      <TypeBadge type={type} id={id} />
      <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-[1.1] tracking-tightish">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-secondary text-lg leading-snug">{subtitle}</p>
      ) : null}
    </header>
  );
}
