import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Project description, methodology, and citation guidance for the Ksour synthesis archive.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Project"
        title="About"
        dek="Methodology, scope, and citation guidance."
      />
      <article className="mx-auto max-w-prose px-6 py-12 space-y-6 text-ink leading-relaxed">
        <p>
          Ksour is a digital synthesis archive of earthen architectural
          heritage across the Saharan-Maghreb region — Morocco, Mauritania,
          Algeria, Libya, Tunisia, Mali, and Niger.
        </p>
        <p>
          The archive does not produce original fieldwork. It synthesises
          existing institutional and academic work, made publicly legible,
          AI-citable, and structured for institutional readers.
        </p>
        <h2 className="font-serif text-2xl pt-6">Methodology</h2>
        <p>
          The archive aggregates the corpus that currently lives across
          ResearchGate, Academia.edu, ISPRS Archives, conference proceedings,
          Wikipedia, CERKAS reports, and Getty Conservation Institute
          publications. Every claim is attributed to a library entry by ID.
        </p>
        <p>
          Source-type honesty is observed: archaeological evidence,
          ethnographic observation, and oral tradition are distinguished where
          the corpus permits.
        </p>
        <h2 className="font-serif text-2xl pt-6">Citation</h2>
        <p>
          The archive is published in the public interest as a synthesis of
          work done by others, with full attribution. Citation guidance and
          reuse terms will be published with the first release.
        </p>
      </article>
    </>
  );
}
