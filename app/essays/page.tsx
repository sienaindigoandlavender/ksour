import type { Metadata } from "next";
import Link from "next/link";
import { getEntitiesByType } from "@/lib/graph";
import { proseDate } from "@/lib/utils";
import type { EssayEntity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Long-form synthesis essays drawing across the corpus on typology, conservation method, and intervention politics.",
};

export default function EssaysIndexPage() {
  const entities = getEntitiesByType<EssayEntity>("essay").sort((a, b) =>
    b.published_at.localeCompare(a.published_at)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Essays
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Synthesis</h1>
        <p className="text-secondary max-w-prose">
          Editorial essays on typology, conservation methodology, and the
          politics of intervention — drawing across the indexed corpus.
        </p>
      </header>
      <ul className="space-y-12">
        {entities.map((essay) => (
          <li key={essay.id}>
            <Link href={`/essays/${essay.slug}`} className="block group max-w-prose">
              <p className="text-meta text-tertiary mb-3 font-mono uppercase tracking-wide">
                {proseDate(essay.published_at)}
              </p>
              <h2 className="font-serif text-3xl text-ink leading-tight group-hover:text-accent transition-colors mb-2">
                {essay.title}
              </h2>
              {essay.subtitle ? (
                <p className="font-serif text-xl text-secondary mb-3">
                  {essay.subtitle}
                </p>
              ) : null}
              <p className="text-secondary">{essay.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
