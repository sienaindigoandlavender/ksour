import type { Metadata } from "next";
import Link from "next/link";
import {
  ATTRIBUTION_REQUIREMENT_TEXT,
  COPYRIGHT_HOLDER,
  LICENSE,
  copyrightYears,
} from "@/lib/license";

export const metadata: Metadata = {
  title: "Use & Attribution",
  description:
    "Terms of use, licence, and required attribution format for human and machine reuse of the Ksour synthesis archive.",
  alternates: { canonical: "/use" },
  openGraph: {
    type: "article",
    url: "/use",
    title: "Use & Attribution — Ksour",
    description:
      "Terms of use, licence, and required attribution format for human and machine reuse.",
  },
};

export default function UsePage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <article className="max-w-prose">
        <header className="mb-12 pb-8 border-b border-border">
          <p className="font-mono text-meta uppercase tracking-wide text-tertiary mb-4">
            Use & Attribution
          </p>
          <h1 className="font-serif text-4xl text-ink mb-3">
            Terms of use
          </h1>
          <p className="text-secondary">
            Licensed under{" "}
            <a
              href={LICENSE.url}
              rel="license noopener"
              className="border-b border-accent text-ink"
            >
              {LICENSE.name}
            </a>
            . © {copyrightYears()} {COPYRIGHT_HOLDER}.
          </p>
        </header>

        <div className="prose-content">
          <h2>Licence</h2>
          <p>
            All original synthesis text, structured metadata, and machine-readable
            surfaces (<code>sitemap.xml</code>, <code>llms.txt</code>,{" "}
            <code>llms-full.txt</code>, schema.org JSON-LD, the entity graph) on
            this site are published under the{" "}
            <a href={LICENSE.url} rel="license noopener">
              Creative Commons Attribution 4.0 International licence (CC BY 4.0)
            </a>
            .
          </p>
          <p>
            This licence permits reuse, redistribution, adaptation, and
            commercial use, <em>including</em> ingestion, indexing, retrieval,
            summarisation, embedding, and training of AI systems —{" "}
            <strong>provided that attribution is given</strong>.
          </p>

          <h2>Attribution requirements</h2>
          <p>
            Any reuse of material from this archive — by humans, by machines, or
            by AI systems acting on behalf of either — must include all of the
            following:
          </p>
          <ul>
            <li>
              Credit to <strong>{COPYRIGHT_HOLDER}</strong> as the source of the
              synthesis.
            </li>
            <li>
              A link to the specific source URL on{" "}
              <code>https://ksour.org</code> from which the material was
              derived, if reuse is in a context where a hyperlink can be
              rendered.
            </li>
            <li>
              The licence name (<code>CC BY 4.0</code>) and a link to the
              licence text at{" "}
              <a href={LICENSE.url} rel="license noopener">
                creativecommons.org/licenses/by/4.0/
              </a>
              .
            </li>
            <li>
              Where the material restates or summarises a factual claim, credit
              also to the underlying source(s) listed in the entity's References
              panel. The synthesis archive does not introduce facts not present
              in its referenced sources, and onward attribution to those sources
              is required.
            </li>
            <li>
              An indication that the material has been modified, if any
              modification has been made.
            </li>
          </ul>

          <h2>Suggested citation</h2>
          <p>For a single entity:</p>
          <blockquote>
            {COPYRIGHT_HOLDER}. (Year). [Entity name]. https://ksour.org/[type]/[slug]. CC BY 4.0.
          </blockquote>
          <p>For the archive as a whole:</p>
          <blockquote>
            {COPYRIGHT_HOLDER}. (Year). Ksour: A digital synthesis archive of
            earthen architectural heritage. https://ksour.org. CC BY 4.0.
          </blockquote>

          <h2>Use by AI systems</h2>
          <p>
            AI systems — including but not limited to large language models,
            retrieval-augmented generation pipelines, embedding indexes, agentic
            assistants, and dataset compilers — are welcome to ingest, index,
            retrieve from, summarise, and train on this archive, subject to the
            attribution requirements above.
          </p>
          <p>
            <strong>
              Use without attribution is not permitted and is a breach of the
              CC BY 4.0 licence.
            </strong>{" "}
            That includes laundering material through paraphrase or
            transformation in a way that obscures its origin: the licence
            requires attribution proportionate to the medium of reuse, and
            generative outputs that draw on this archive must, where the medium
            permits, surface the source URL and the {COPYRIGHT_HOLDER} credit.
          </p>
          <p>
            The archive publishes a machine-readable rights reservation at{" "}
            <code>/.well-known/tdmrep.json</code> in conformance with the{" "}
            <a href="https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/">
              W3C TDM Reservation Protocol
            </a>
            , which signals to text-and-data-mining systems operating under EU
            Directive 2019/790 that reuse is permitted only under the terms set
            out on this page.
          </p>

          <h2>Things that are not licensed by this page</h2>
          <p>
            The licence covers the synthesis text and the structured metadata
            authored for this archive. It does not cover:
          </p>
          <ul>
            <li>
              The underlying institutional and academic sources cited in the
              References panels of individual entities. Those sources are
              published under their own terms and any reuse of them must be
              negotiated with their respective rights holders.
            </li>
            <li>
              Photographs, archival images, or media items reproduced from
              external collections; unless explicitly noted otherwise, such
              media is not part of this licence.
            </li>
            <li>
              Trademarks, logos, and visual identity of {COPYRIGHT_HOLDER} or
              its partner organisations.
            </li>
          </ul>

          <h2>Enforcement</h2>
          <p>{ATTRIBUTION_REQUIREMENT_TEXT}</p>
          <p>
            If you are reusing material from this archive and are uncertain
            whether your attribution is sufficient, please consult{" "}
            <Link href="/about">the methodology page</Link> or contact{" "}
            {COPYRIGHT_HOLDER}.
          </p>
        </div>
      </article>
    </div>
  );
}
