import type { MetadataRoute } from "next";
import { getEntitiesByType } from "@/lib/graph";
import type { EntityType } from "@/lib/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

interface DetailSpec {
  prefix: string;
  priority: number;
  changeFrequency: Freq;
}

const DETAIL: Partial<Record<EntityType, DetailSpec>> = {
  atlas: { prefix: "/atlas", priority: 0.8, changeFrequency: "monthly" },
  typology: { prefix: "/typology", priority: 0.8, changeFrequency: "monthly" },
  glossary: { prefix: "/glossary", priority: 0.6, changeFrequency: "monthly" },
  actor: { prefix: "/actors", priority: 0.6, changeFrequency: "monthly" },
  library: { prefix: "/library", priority: 0.6, changeFrequency: "monthly" },
  essay: { prefix: "/essays", priority: 0.6, changeFrequency: "monthly" },
};

interface StaticSpec {
  path: string;
  priority: number;
  changeFrequency: Freq;
}

const STATIC_ROUTES: StaticSpec[] = [
  { path: "", priority: 0.9, changeFrequency: "weekly" },
  { path: "/atlas", priority: 0.9, changeFrequency: "weekly" },
  { path: "/typology", priority: 0.9, changeFrequency: "weekly" },
  { path: "/glossary", priority: 0.9, changeFrequency: "weekly" },
  { path: "/library", priority: 0.9, changeFrequency: "weekly" },
  { path: "/actors", priority: 0.9, changeFrequency: "weekly" },
  { path: "/timeline", priority: 0.9, changeFrequency: "weekly" },
  { path: "/essays", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/use", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((s) => ({
    url: `${SITE}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  const entityRoutes: MetadataRoute.Sitemap = (
    Object.keys(DETAIL) as Array<keyof typeof DETAIL>
  ).flatMap((type) => {
    const spec = DETAIL[type]!;
    return getEntitiesByType(type).map((e) => ({
      url: `${SITE}${spec.prefix}/${e.slug}`,
      lastModified: now,
      changeFrequency: spec.changeFrequency,
      priority: spec.priority,
    }));
  });

  return [...staticRoutes, ...entityRoutes];
}
