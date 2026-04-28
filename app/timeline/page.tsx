import type { Metadata } from "next";
import { getEntitiesByType, getEntity } from "@/lib/graph";
import EntityLink from "@/components/shared/EntityLink";
import EntityBody from "@/components/entity/EntityBody";
import type { TimelineEntity } from "@/lib/types";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Chronological view of restoration interventions, UNESCO listings, key publications, and institutional milestones.",
};

export default function TimelineIndexPage() {
  const entities = getEntitiesByType<TimelineEntity>("timeline").sort(
    (a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0)
  );

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <header className="mb-12">
        <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-3">
          Timeline
        </p>
        <h1 className="font-serif text-4xl text-ink mb-4">Chronology</h1>
        <p className="text-secondary max-w-prose">
          Restoration interventions, UNESCO listings, key publications,
          institutions founded, and disasters — by year.
        </p>
      </header>
      <ol className="divide-y divide-border">
        {entities.map((event) => {
          const refs = [
            ...(event.sites ?? []),
            ...(event.actors ?? []),
            ...(event.library_refs ?? []),
          ]
            .map((id) => getEntity(id))
            .filter(Boolean);
          return (
            <li key={event.id} className="py-6 grid grid-cols-[80px_1fr] gap-6">
              <div>
                <p className="font-serif text-2xl text-ink">{event.year}</p>
                <p className="text-meta text-tertiary mt-1 font-mono">
                  {event.event_type}
                </p>
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink mb-2">{event.title}</h2>
                <EntityBody html={event.body} />
                {refs.length ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mt-4">
                    {refs.map((r) => (
                      <EntityLink key={r!.id} entity={r!} />
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
