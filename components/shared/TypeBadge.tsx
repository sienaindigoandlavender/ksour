import { labelFor } from "@/lib/utils";
import type { EntityType } from "@/lib/types";

interface Props {
  type: EntityType;
  id?: string;
}

export default function TypeBadge({ type, id }: Props) {
  return (
    <p className="meta">
      {labelFor(type)}
      {id ? <span className="ml-2 text-tertiary">· {id}</span> : null}
    </p>
  );
}
