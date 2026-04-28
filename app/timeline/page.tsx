import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import EntityLink from "@/components/shared/EntityLink";
import { getEntitiesByType } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Chronological view of restoration interventions, UNESCO listings, key publications, and institutional milestones.",
};

export default function TimelinePage() {
  const events = getEntitiesByType("timeline").sort(
    (a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0)
  );

  return (
    <>
      <PageHeader
        eyebrow="Chronology"
        title="Timeline"
        dek="Restoration interventions, UNESCO listings, key publications, institutions founded, and disasters — by year."
      />
      <div className="mx-auto max-w-page px-6 py-12">
        {events.length === 0 ? (
          <p className="text-secondary text-sm max-w-prose">
            No events yet. Timeline nodes will appear here once seeded into{" "}
            <code>content/timeline/</code>.
          </p>
        ) : (
          <ol className="divide-y divide-rule">
            {events.map((ev) => (
              <li key={ev.id} className="py-6 grid md:grid-cols-12 gap-4">
                <div className="md:col-span-2">
                  <p className="font-serif text-2xl">{ev.year}</p>
                  <p className="meta mt-1">{ev.event_type}</p>
                </div>
                <div className="md:col-span-10">
                  <h2 className="font-serif text-xl">{ev.title}</h2>
                  <div
                    className="prose-body mt-3 text-secondary text-sm"
                    dangerouslySetInnerHTML={{ __html: ev.bodyHtml }}
                  />
                  {(ev.sites?.length || ev.actors?.length || ev.library_refs?.length) ? (
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      {[...(ev.sites ?? []), ...(ev.actors ?? []), ...(ev.library_refs ?? [])].map(
                        (id) => (
                          <EntityLink key={id} id={id} showType />
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
