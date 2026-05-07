import type { MetadataRoute } from "next";
import { getEntitiesByType } from "@/lib/graph";
import type { EntityType } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org";

const ROUTE_PREFIX: Partial<Record<EntityType, string>> = {
  typology: "/typology",
  atlas: "/atlas",
  library: "/library",
  actor: "/actors",
  glossary: "/glossary",
  essay: "/essays",
};

export default function sitemap(): MetadataRoute.Sitemap {
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
    "/use",
  ].map((p) => ({ url: `${SITE}${p}`, lastModified: now }));

  const entityRoutes: MetadataRoute.Sitemap = (Object.keys(ROUTE_PREFIX) as Array<
    keyof typeof ROUTE_PREFIX
  >).flatMap((type) =>
    getEntitiesByType(type).map((e) => ({
      url: `${SITE}${ROUTE_PREFIX[type]}/${e.slug}`,
      lastModified: now,
    }))
  );

  return [...staticRoutes, ...entityRoutes];
}
