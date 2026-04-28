import Link from "next/link";

const navItems = [
  { href: "/typology", label: "Typology" },
  { href: "/atlas", label: "Atlas" },
  { href: "/library", label: "Library" },
  { href: "/actors", label: "Actors" },
  { href: "/glossary", label: "Glossary" },
  { href: "/timeline", label: "Timeline" },
  { href: "/essays", label: "Essays" },
];

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-content mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-tight">
          Ksour
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-secondary hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
