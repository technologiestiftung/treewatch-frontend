import { TreeGeoJsonFeature, TreesGeoJson } from '@lib/hooks/useTreeData'
import { getCurrentSeason } from '@lib/utils/getCurrentSeason'

export type ShadingType = {
  fall: number | null
  spring: number | null
  summer: number | null
  winter: number | null
}

/**
 * Fetches the current shading data for a tree.
 * @param treeId string
 * @param csrfToken string
 * @returns Promise<number | undefined>
 */
export const getShading = async (
  treeId: string
): Promise<number | undefined> => {
  const currentSeason = getCurrentSeason()
  const response = await fetch(`/trees.geojson`)
  const trees = (await response.json()) as TreesGeoJson
  const foundTree = trees.features.find(
    (tree: TreeGeoJsonFeature) => tree.properties.trees_id === treeId
  )
  if (foundTree && currentSeason !== undefined) {
    return foundTree.properties[`shading_${currentSeason}`]
  }
  return undefined
}
