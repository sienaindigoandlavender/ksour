import Link from "next/link";
import type { AtlasEntity } from "@/lib/types";

interface Props {
  sites: AtlasEntity[];
}

export default function AtlasIndexList({ sites }: Props) {
  const byCountry = sites.reduce<Record<string, AtlasEntity[]>>((acc, s) => {
    (acc[s.country] ??= []).push(s);
    return acc;
  }, {});

  const countries = Object.keys(byCountry).sort();

  return (
    <section
      aria-label="Atlas site index"
      className="border-t border-border px-6 py-12"
    >
      <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-8">
        All documented sites
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {countries.map((country) => {
          const list = byCountry[country].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          return (
            <div key={country}>
              <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
                {country}
              </p>
              <ul className="space-y-1.5">
                {list.map((site) => (
                  <li key={site.id}>
                    <Link
                      href={`/atlas/${site.slug}`}
                      className="text-ink hover:text-accent transition-colors text-sm"
                    >
                      {site.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
