import Link from "next/link";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="rule-bottom">
      <div className="mx-auto max-w-page px-6 py-6 flex items-baseline justify-between gap-8">
        <Link href="/" className="font-serif text-2xl no-underline tracking-tightish">
          Ksour
        </Link>
        <Nav />
      </div>
    </header>
  );
}
