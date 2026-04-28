import Link from "next/link";
import type { AtlasEntity } from "@/lib/types";

interface Props {
  entries: AtlasEntity[];
}

export default function AtlasList({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-secondary text-sm">
        No atlas entries yet. Sites will appear here once content is seeded.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-rule">
      {entries.map((e) => (
        <li key={e.id} className="py-5 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <Link
              href={`/atlas/${e.slug}`}
              className="font-serif text-xl no-underline hover:text-accent"
            >
              {e.name}
            </Link>
            {e.alternate_names?.length ? (
              <p className="text-tertiary text-xs mt-1">
                {e.alternate_names.join(" · ")}
              </p>
            ) : null}
          </div>
          <div className="md:col-span-3 text-sm text-secondary">
            {e.region}
            <br />
            <span className="meta">{e.country}</span>
          </div>
          <div className="md:col-span-2 text-sm">
            <span className="meta">{e.condition}</span>
          </div>
          <div className="md:col-span-2 text-sm">
            {e.unesco_status ? (
              <span className="meta">{e.unesco_status}</span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
