import type { MetadataRoute } from "next";
import { getGraph } from "@/lib/graph";
import { pathFor } from "@/lib/utils";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const g = getGraph();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/typology",
    "/atlas",
    "/library",
    "/actors",
    "/glossary",
    "/timeline",
    "/essays",
    "/about",
  ].map((p) => ({ url: `${SITE}${p}`, lastModified: now }));

  const entityRoutes: MetadataRoute.Sitemap = Object.values(g.entities)
    .filter((e) => e.type !== "timeline")
    .map((e) => ({
      url: `${SITE}${pathFor(e.type, e.slug)}`,
      lastModified: now,
    }));

  return [...staticRoutes, ...entityRoutes];
}
