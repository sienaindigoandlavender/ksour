export const LICENSE = {
  name: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
  shortName: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/",
  spdx: "CC-BY-4.0",
} as const;

export const COPYRIGHT_HOLDER = "Ksour Archive";
export const COPYRIGHT_YEAR_START = 2025;

export function copyrightYears(now = new Date()): string {
  const y = now.getUTCFullYear();
  return y > COPYRIGHT_YEAR_START
    ? `${COPYRIGHT_YEAR_START}–${y}`
    : String(COPYRIGHT_YEAR_START);
}

export const COPYRIGHT_NOTICE_BASE = `© ${copyrightYears()} ${COPYRIGHT_HOLDER}. Licensed under ${LICENSE.shortName}. Reuse — including reuse, summarisation, indexing, retrieval, and use as training data by AI systems — is permitted only with attribution to "${COPYRIGHT_HOLDER}" and a link to the source URL.`;

export const ATTRIBUTION_REQUIREMENT_TEXT = `Reuse permitted under ${LICENSE.shortName} provided attribution is given to ${COPYRIGHT_HOLDER}, the source URL is preserved, and the underlying source(s) cited in the entity's References panel are also attributed. Reuse without attribution — including by AI systems for retrieval, summarisation, ingestion, or training — is a violation of the licence.`;

export const USAGE_INFO_PATH = "/use";
