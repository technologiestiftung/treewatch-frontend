import { TreeGeoJsonFeature, TreesGeoJson } from '@lib/hooks/useTreeData'

export type TreeRainAmountType = number

/**
 * Fetches the rain data for a tree (in mm for the current day).
 * 2024-07-11: This project is about to be archived.
 * For archiving purposes, we make the project independent of the backend, database and vector tiles.
 * The rain data is taken from the static trees.geojson file.
 * @param treeId string
 * @returns Promise<TreeRainAmountType[] | undefined>
 */
export const getTreeRainAmount = async (
  treeId: string
): Promise<TreeRainAmountType | undefined> => {
  if (!treeId) return
  const response = await fetch(`/trees.geojson`)
  const trees = (await response.json()) as TreesGeoJson
  const foundTree = trees.features.find(
    (tree: TreeGeoJsonFeature) => tree.properties.trees_id === treeId
  )
  if (foundTree) {
    return foundTree.properties.rainfall_in_mm
  }
  return undefined
}
