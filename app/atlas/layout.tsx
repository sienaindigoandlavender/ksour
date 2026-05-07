import type { Metadata } from "next";
import { getEntitiesByType } from "@/lib/graph";
import JsonLd from "@/components/shared/JsonLd";
import { collectionJsonLd } from "@/lib/schema-org";
import type { AtlasEntity } from "@/lib/types";

const DESCRIPTION =
  "Geographic database of documented kasbahs, ksour, igherman, agadirs, tighremts, and ghorfas across Morocco, Mauritania, Algeria, Libya, Tunisia, Mali, and Niger.";

export const metadata: Metadata = {
  title: "Atlas",
  description: DESCRIPTION,
  alternates: { canonical: "/atlas" },
  openGraph: {
    type: "website",
    url: "/atlas",
    title: "Atlas — Ksour",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "Atlas — Ksour", description: DESCRIPTION },
};

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  const sites = getEntitiesByType<AtlasEntity>("atlas");
  return (
    <>
      <JsonLd
        data={collectionJsonLd({
          name: "Atlas — Ksour",
          description: DESCRIPTION,
          path: "/atlas",
          items: sites.map((e) => ({ name: e.name, url: `/atlas/${e.slug}` })),
        })}
      />
      {children}
    </>
  );
}
