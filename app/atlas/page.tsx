import { getEntitiesByType } from "@/lib/graph";
import type { AtlasEntity } from "@/lib/types";
import AtlasExplorer from "@/components/atlas/AtlasExplorer";
import AtlasIndexList from "@/components/atlas/AtlasIndexList";

export const metadata = {
  title: "Atlas",
  description:
    "Geographic database of documented earthen architectural sites across the Saharan-Maghreb region.",
};

export default function AtlasPage() {
  const sites = getEntitiesByType<AtlasEntity>("atlas");

  return (
    <>
      <AtlasExplorer sites={sites} />
      <AtlasIndexList sites={sites} />
    </>
  );
}
