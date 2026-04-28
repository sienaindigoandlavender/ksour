import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import { getEntitiesByType } from "@/lib/graph";
import { proseDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Long-form synthesis essays drawing across the corpus on typology, conservation method, and intervention politics.",
};

export default function EssaysIndex() {
  const essays = getEntitiesByType("essay").sort(
    (a, b) => +new Date(b.published_at) - +new Date(a.published_at)
  );

  return (
    <>
      <PageHeader
        eyebrow="Synthesis"
        title="Essays"
        dek="Editorial essays on typology, conservation methodology, and the politics of intervention."
      />
      <div className="mx-auto max-w-page px-6 py-12">
        {essays.length === 0 ? (
          <p className="text-secondary text-sm max-w-prose">
            No essays yet. The first piece will be published shortly.
          </p>
        ) : (
          <ul className="divide-y divide-rule">
            {essays.map((e) => (
              <li key={e.id} className="py-8">
                <p className="meta">{proseDate(e.published_at)}</p>
                <Link
                  href={`/essays/${e.slug}`}
                  className="block mt-2 font-serif text-3xl no-underline hover:text-accent leading-snug"
                >
                  {e.title}
                </Link>
                {e.subtitle ? (
                  <p className="text-secondary mt-2">{e.subtitle}</p>
                ) : null}
                <p className="mt-3 max-w-2xl text-sm text-secondary leading-relaxed">{e.dek}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
