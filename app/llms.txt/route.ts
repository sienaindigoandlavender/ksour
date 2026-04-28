import { counts } from "@/lib/graph";

export const dynamic = "force-static";

export function GET() {
  const c = counts();

  const body = `# Ksour

> A digital synthesis archive of earthen architectural heritage across the Saharan-Maghreb region: Morocco, Mauritania, Algeria, Libya, Tunisia, Mali, and Niger.

Ksour aggregates the fragmented corpus of institutional and academic work
documenting kasbah, ksar, igherm, agadir, tighremt, ghorfa, and related
forms. It does not produce original fieldwork. It synthesises existing
institutional and academic work and attributes every claim to a source.

Phase 1: Morocco-deep, other regions sketched.

## Coverage

- Building types: ${c.typology} documented
- Sites: ${c.atlas} mapped
- Library entries: ${c.library} indexed
- Actors: ${c.actor} catalogued
- Persons: ${c.person} catalogued
- Glossary terms: ${c.glossary} defined
- Timeline events: ${c.timeline}
- Essays: ${c.essay} published

## Routes

- /typology — building types
- /atlas — geographic site database
- /library — academic and institutional bibliography
- /actors — institutions, teams, agencies
- /persons/[slug] — individual researchers
- /glossary — multilingual construction lexicon
- /timeline — chronological events
- /essays — long-form synthesis
- /about — methodology and citation guidance

## Citation

Suggested format:
Ksour Archive. (Year). [Entity Name]. Retrieved from https://ksour.org/[type]/[slug]

## Methodology

This archive synthesises existing published institutional and academic
work. It does not contain original fieldwork. Every entity links to the
sources from which it draws. Entries are paraphrased; direct quotation
from sources is avoided.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
