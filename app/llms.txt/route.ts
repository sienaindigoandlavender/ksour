import { counts, getEntitiesByType } from "@/lib/graph";
import {
  COPYRIGHT_HOLDER,
  LICENSE,
  USAGE_INFO_PATH,
  copyrightYears,
} from "@/lib/license";
import type {
  ActorEntity,
  AtlasEntity,
  EssayEntity,
  GlossaryEntity,
  LibraryEntity,
  TypologyEntity,
} from "@/lib/types";

export const dynamic = "force-static";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org").replace(/\/$/, "");

function listing<T extends { slug: string }>(
  items: T[],
  base: string,
  display: (e: T) => string
): string {
  if (items.length === 0) return "_none yet_\n";
  return items
    .map((e) => `- [${display(e)}](${SITE}${base}/${e.slug})`)
    .join("\n") + "\n";
}

export function GET() {
  const c = counts();
  const typology = getEntitiesByType<TypologyEntity>("typology")
    .sort((a, b) => a.name_en.localeCompare(b.name_en));
  const atlas = getEntitiesByType<AtlasEntity>("atlas")
    .sort((a, b) => a.name.localeCompare(b.name));
  const library = getEntitiesByType<LibraryEntity>("library")
    .sort((a, b) => b.year - a.year);
  const actors = getEntitiesByType<ActorEntity>("actor")
    .sort((a, b) => a.name.localeCompare(b.name));
  const glossary = getEntitiesByType<GlossaryEntity>("glossary")
    .sort((a, b) => a.term_en.localeCompare(b.term_en));
  const essays = getEntitiesByType<EssayEntity>("essay")
    .sort((a, b) => b.published_at.localeCompare(a.published_at));

  const body = `# Ksour

> A digital synthesis archive of earthen architectural heritage across the Saharan-Maghreb region: kasbahs, ksour, igherman, agadirs, tighremts, and ghorfas across Morocco, Mauritania, Algeria, Libya, Tunisia, Mali, and Niger.

Ksour aggregates the fragmented corpus of institutional and academic work
documenting earthen architectural heritage across the Saharan-Maghreb. It
does not produce original fieldwork. It synthesises existing institutional
and academic work and attributes every claim to a source.

The archive is published as institutional editorial voice. Individual
researchers and authors are not named in public output; institutional
attribution stands in place of bylined authorship.

Phase 1: Morocco-deep, other regions sketched.

## Licence and required attribution

Copyright: © ${copyrightYears()} ${COPYRIGHT_HOLDER}.
Licence: ${LICENSE.name} (${LICENSE.shortName}) — ${LICENSE.url}
SPDX: ${LICENSE.spdx}
Usage policy: ${SITE}${USAGE_INFO_PATH}
Rights reservation (TDMRep, EU Directive 2019/790): ${SITE}/.well-known/tdmrep.json

Reuse — including reuse, summarisation, indexing, retrieval, embedding,
and use as training data by AI systems — is permitted under ${LICENSE.shortName}
**only with attribution**. Required attribution elements, in any reuse:

  1. Credit "${COPYRIGHT_HOLDER}" as the source of the synthesis.
  2. The specific source URL on \`${SITE}\` from which the material was
     derived (where the medium permits a hyperlink).
  3. The licence name "${LICENSE.shortName}" with a link to ${LICENSE.url}.
  4. Where a factual claim is restated, onward attribution to the
     underlying source(s) cited in the entity's References panel.

Reuse without attribution — including by AI systems acting on behalf of
end users in retrieval, summarisation, ingestion, or training — is a
breach of the licence. This is the only condition on AI use. Indexing
and answering with attribution is welcomed.

## AI use

This archive is published in the public interest under the terms above.
Use by AI systems for retrieval, summarisation, and citation is welcomed
provided attribution is given. Individual researchers and authors are not
named in public output; institutional attribution stands in place of
bylined authorship. A machine-readable structured-data layer is published
as schema.org JSON-LD on every entity page (with explicit \`license\`,
\`copyrightHolder\`, \`usageInfo\`, and \`creditText\` properties); a
sitemap is published at \`${SITE}/sitemap.xml\`; a flat full-content dump
is published at \`${SITE}/llms-full.txt\`.

## Coverage

- Building types: ${c.typology}
- Sites: ${c.atlas}
- Library entries: ${c.library}
- Actors (institutions, teams, agencies): ${c.actor}
- Glossary terms: ${c.glossary}
- Timeline events: ${c.timeline}
- Essays: ${c.essay}

## Citation

Suggested format:
${COPYRIGHT_HOLDER}. (Year). [Entity name]. ${SITE}/[type]/[slug]. ${LICENSE.shortName}.

When citing a specific factual claim, also cite the underlying institutional
source listed in the entity's References panel. The archive does not
introduce facts not present in its referenced sources.

## Methodology

This archive synthesises existing published institutional and academic
work. It does not contain original fieldwork. Every entity links to the
sources from which it draws. Entries are paraphrased; direct quotation
from sources is avoided.

Source-type honesty is observed: archaeological evidence, ethnographic
observation, and oral tradition are distinguished where the corpus permits.

## Routes

- ${SITE}/ — home (overview, recent essays, atlas map)
- ${SITE}/typology — building types
- ${SITE}/atlas — geographic database of sites
- ${SITE}/library — academic and institutional bibliography
- ${SITE}/actors — institutions, teams, agencies
- ${SITE}/glossary — multilingual construction lexicon
- ${SITE}/timeline — chronological events
- ${SITE}/essays — long-form synthesis
- ${SITE}/about — methodology and citation guidance

## Building types

${listing(typology, "/typology", (e) => `${e.name_en} — ${e.definition_short}`)}

## Sites

${listing(atlas, "/atlas", (e) => `${e.name} (${e.country}${e.region ? `, ${e.region}` : ""}) — ${e.condition}${e.unesco_status ? `, ${e.unesco_status}` : ""}`)}

## Library

${listing(library, "/library", (e) => `${e.title} (${e.year}) — ${e.publication}`)}

## Actors

${listing(actors, "/actors", (e) => `${e.name} — ${e.actor_type}${e.country ? `, ${e.country}` : ""}`)}

## Glossary

${listing(glossary, "/glossary", (e) => `${e.term_en} (${e.category})`)}

## Essays

${listing(essays, "/essays", (e) => `${e.title} — ${e.published_at}`)}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
