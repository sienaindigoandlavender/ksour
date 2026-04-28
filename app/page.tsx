import Link from "next/link";
import { counts } from "@/lib/graph";

export default function HomePage() {
  const c = counts();
  return (
    <>
      <section className="rule-bottom">
        <div className="mx-auto max-w-page px-6 py-20 md:py-32 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <p className="meta mb-6">A synthesis archive · est. 2026</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tightish">
              Earthen architectural heritage of the Saharan-Maghreb, indexed
              and made legible.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-secondary leading-relaxed">
              Ksour aggregates the fragmented corpus of institutional and
              academic work documenting kasbah, ksar, igherm, agadir, tighremt,
              and ghorfa across Morocco, Mauritania, Algeria, Libya, Tunisia,
              Mali, and Niger. It synthesises what is known, attributes what
              has been claimed, and marks what remains contested.
            </p>
          </div>
          <aside className="md:col-span-4 md:border-l md:border-rule md:pl-10">
            <p className="meta mb-3">Phase 1</p>
            <p className="text-sm leading-relaxed">
              Morocco is documented in depth. Other regions are sketched and
              expanding. Coverage is uneven by design: the archive reflects
              the corpus that exists, not the geography it describes.
            </p>
          </aside>
        </div>
      </section>

      <section className="rule-bottom">
        <div className="mx-auto max-w-page px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
          {[
            { label: "Building types", value: c.typology, href: "/typology" },
            { label: "Sites", value: c.atlas, href: "/atlas" },
            { label: "Library", value: c.library, href: "/library" },
            { label: "Actors", value: c.actor, href: "/actors" },
            { label: "Glossary", value: c.glossary, href: "/glossary" },
            { label: "Persons", value: c.person, href: "/actors" },
            { label: "Timeline", value: c.timeline, href: "/timeline" },
            { label: "Essays", value: c.essay, href: "/essays" },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="no-underline group">
              <p className="meta">{s.label}</p>
              <p className="font-serif text-3xl mt-1 group-hover:text-accent">{s.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-page px-6 py-16 grid md:grid-cols-3 gap-10">
          <Link href="/atlas" className="no-underline group">
            <p className="meta mb-3">Atlas</p>
            <h2 className="font-serif text-2xl group-hover:text-accent">
              Documented sites, mapped
            </h2>
            <p className="mt-3 text-secondary text-sm leading-relaxed">
              Geographic index of kasbah, ksar, and related sites with condition,
              materials, and intervention history.
            </p>
          </Link>
          <Link href="/library" className="no-underline group">
            <p className="meta mb-3">Library</p>
            <h2 className="font-serif text-2xl group-hover:text-accent">
              Indexed bibliography
            </h2>
            <p className="mt-3 text-secondary text-sm leading-relaxed">
              Public academic papers, institutional reports, books, and
              substantive articles, with paraphrased synthesis.
            </p>
          </Link>
          <Link href="/essays" className="no-underline group">
            <p className="meta mb-3">Essays</p>
            <h2 className="font-serif text-2xl group-hover:text-accent">
              Long-form synthesis
            </h2>
            <p className="mt-3 text-secondary text-sm leading-relaxed">
              Editorial essays drawing across the corpus on typology,
              conservation method, and intervention politics.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
