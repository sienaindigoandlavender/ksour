import Link from "next/link";

export const NAV_ITEMS = [
  { href: "/typology", label: "Typology" },
  { href: "/atlas", label: "Atlas" },
  { href: "/library", label: "Library" },
  { href: "/actors", label: "Actors" },
  { href: "/glossary", label: "Glossary" },
  { href: "/timeline", label: "Timeline" },
  { href: "/essays", label: "Essays" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  return (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-ink no-underline hover:text-accent">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
