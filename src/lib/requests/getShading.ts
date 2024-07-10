import { Database } from "@lib/types/database";
import { getCurrentSeason } from "@lib/utils/getCurrentSeason";

export type ShadingType = Database["public"]["Tables"]["shading"]["Row"];
/**
 * Fetches the current shading data for a tree.
 * @param treeId string
 * @param csrfToken string
 * @returns Promise<number | undefined>
 */
export const getShading = async (
  treeId: string,
): Promise<number | undefined> => {
  const currentSeason = getCurrentSeason();

  if (!currentSeason) {
    console.error("Unable to find shading data for current season");
    return;
  }

  const response = await fetch("/shading.json");
  if (!response.ok) {
    const txt = await response.text();
    console.error(txt);
    throw new Error(txt);
  }
  const shadingData = await response.json() as ShadingType[];

  const shadingForTree = shadingData.find((
    shading: ShadingType,
  ) => shading.tree_id === treeId);

  return shadingForTree && (shadingForTree[currentSeason] as number);
};
