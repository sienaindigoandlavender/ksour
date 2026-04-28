import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-content mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-meta text-tertiary">
        <div>
          <p className="font-serif text-base text-ink mb-2">Ksour</p>
          <p>
            A digital synthesis archive of earthen architectural heritage across the
            Saharan-Maghreb region.
          </p>
        </div>
        <div>
          <p className="text-ink mb-2 font-mono uppercase tracking-wide">Modules</p>
          <ul className="space-y-1">
            <li><Link href="/typology">Typology</Link></li>
            <li><Link href="/atlas">Atlas</Link></li>
            <li><Link href="/library">Library</Link></li>
            <li><Link href="/glossary">Glossary</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-ink mb-2 font-mono uppercase tracking-wide">About</p>
          <ul className="space-y-1">
            <li><Link href="/about">Methodology</Link></li>
            <li><Link href="/llms.txt">For AI systems</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 py-6 border-t border-border text-meta text-tertiary">
        <p>Ksour Archive · Synthesis of public scholarly and institutional work</p>
      </div>
    </footer>
  );
}
