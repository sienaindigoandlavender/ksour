import Link from "next/link";
import { getEntitiesByType } from "@/lib/graph";
import { proseDate } from "@/lib/utils";
import HomeAtlasMap from "@/components/home/HomeAtlasMap";
import JsonLd from "@/components/shared/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/schema-org";
import type { AtlasEntity, AtlasPoint, EssayEntity, LibraryEntity } from "@/lib/types";

export default function HomePage() {
  const atlasEntities = getEntitiesByType<AtlasEntity>("atlas");
  const atlasPoints: AtlasPoint[] = atlasEntities.map((e) => ({
    id: e.id,
    name: e.name,
    lat: e.lat,
    lng: e.lng,
    condition: e.condition,
    country: e.country,
    typology: e.typology,
    unesco_status: e.unesco_status ?? null,
  }));

  const recentEssays = getEntitiesByType<EssayEntity>("essay")
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 3);

  const sites = atlasEntities.length;
  const library = getEntitiesByType<LibraryEntity>("library").length;

  const modules = [
    { href: "/typology", label: "Typology", desc: "Building types and forms" },
    { href: "/atlas", label: "Atlas", desc: "Geographic database of sites" },
    { href: "/library", label: "Library", desc: "Indexed academic and institutional sources" },
    { href: "/actors", label: "Actors", desc: "Institutions, teams, and agencies" },
    { href: "/glossary", label: "Glossary", desc: "Multilingual construction lexicon" },
    { href: "/timeline", label: "Timeline", desc: "Chronological events" },
    { href: "/essays", label: "Essays", desc: "Long-form synthesis" },
  ];

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="max-w-prose">
          <h1 className="font-serif text-5xl leading-tight text-ink mb-6">
            A synthesis archive of earthen architectural heritage across the
            Saharan-Maghreb region.
          </h1>
          <p className="text-lg text-secondary">
            Ksour aggregates and structures the published institutional and
            academic work on the kasbahs, ksour, igherman, and earthen
            settlements of Morocco, Mauritania, Algeria, Libya, Tunisia, Mali,
            and Niger. Phase 1 is Morocco-deep; other regions grow as the
            corpus deepens.
          </p>
        </div>
        <div>
          <HomeAtlasMap points={atlasPoints} />
          <div className="mt-3 flex items-center justify-between font-mono text-meta uppercase tracking-wide text-tertiary">
            <span>{atlasPoints.length} documented sites</span>
            <Link href="/atlas" className="hover:text-accent transition-colors">
              Open atlas →
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-6">
          Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {modules.map((m) => (
            <Link key={m.href} href={m.href} className="block group">
              <p className="font-serif text-xl text-ink group-hover:text-accent transition-colors mb-1">
                {m.label}
              </p>
              <p className="text-sm text-secondary">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div>
            <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
              Sites
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { slug: "ait-ben-haddou", name: "Aït Ben Haddou" },
                { slug: "kasbah-taourirt", name: "Kasbah Taourirt" },
                { slug: "ghardaia", name: "Ghardaïa" },
                { slug: "chinguetti", name: "Chinguetti" },
                { slug: "ouadane", name: "Ouadane" },
                { slug: "ksar-ouled-soltane", name: "Ksar Ouled Soltane" },
                { slug: "djenne", name: "Djenné" },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/atlas/${item.slug}`}
                    className="text-ink hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
              Glossary
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { slug: "pise", name: "Pisé" },
                { slug: "maalem", name: "Maalem" },
                { slug: "tighremt", name: "Tighremt" },
                { slug: "khettara", name: "Khettara" },
                { slug: "adobe", name: "Adobe" },
                { slug: "mellah", name: "Mellah" },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/glossary/${item.slug}`}
                    className="text-ink hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
              Building types
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { slug: "kasbah", name: "Kasbah" },
                { slug: "ksar", name: "Ksar" },
                { slug: "tighremt", name: "Tighremt" },
                { slug: "agadir", name: "Agadir" },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/typology/${item.slug}`}
                    className="text-ink hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
              Library
            </p>
            <ul className="space-y-2 text-sm">
              {[
                {
                  slug: "unesco-ait-ben-haddou-1987",
                  name: "Aït Ben Haddou inscription (UNESCO, 1987)",
                },
                {
                  slug: "boussalh-2018-taourirt",
                  name: "Kasbah Taourirt conservation plan (2018)",
                },
                {
                  slug: "unesco-mauritanian-ksour-1996",
                  name: "Mauritanian ksour inscription (UNESCO, 1996)",
                },
                {
                  slug: "unesco-mzab-1982",
                  name: "M'Zab Valley inscription (UNESCO, 1982)",
                },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/library/${item.slug}`}
                    className="text-ink hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {recentEssays.length > 0 ? (
        <section className="mb-20">
          <h2 className="font-mono text-meta uppercase tracking-wide text-tertiary mb-6">
            Recent essays
          </h2>
          <ul className="space-y-6">
            {recentEssays.map((essay) => (
              <li key={essay.id}>
                <Link href={`/essays/${essay.slug}`} className="block group max-w-prose">
                  <p className="font-serif text-2xl text-ink group-hover:text-accent transition-colors mb-1">
                    {essay.title}
                  </p>
                  {essay.subtitle ? (
                    <p className="text-secondary mb-2">{essay.subtitle}</p>
                  ) : null}
                  <p className="text-meta text-tertiary font-mono">
                    {proseDate(essay.published_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-t border-border pt-12 text-meta text-tertiary font-mono">
        <p>
          {sites} sites · {library} sources indexed
        </p>
      </section>
    </div>
  );
}
