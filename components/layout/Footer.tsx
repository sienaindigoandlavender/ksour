import Link from "next/link";

export default function Footer() {
  return (
    <footer className="rule-top mt-24">
      <div className="mx-auto max-w-page px-6 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <p className="font-serif text-lg">Ksour</p>
          <p className="text-secondary mt-2 max-w-sm">
            A synthesis archive of earthen architectural heritage across the
            Saharan-Maghreb region. Published in the public interest.
          </p>
        </div>
        <div>
          <p className="meta mb-3">Sections</p>
          <ul className="space-y-1">
            <li><Link href="/typology" className="no-underline hover:text-accent">Typology</Link></li>
            <li><Link href="/atlas" className="no-underline hover:text-accent">Atlas</Link></li>
            <li><Link href="/library" className="no-underline hover:text-accent">Library</Link></li>
            <li><Link href="/actors" className="no-underline hover:text-accent">Actors</Link></li>
          </ul>
        </div>
        <div>
          <p className="meta mb-3">Project</p>
          <ul className="space-y-1">
            <li><Link href="/about" className="no-underline hover:text-accent">About &amp; methodology</Link></li>
            <li><Link href="/essays" className="no-underline hover:text-accent">Essays</Link></li>
            <li><Link href="/llms.txt" className="no-underline hover:text-accent">llms.txt</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-page px-6 pb-10">
        <p className="meta">© {new Date().getFullYear()} Ksour</p>
      </div>
    </footer>
  );
}
