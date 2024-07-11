export type TreeRainAmountType = number

interface RainfallData {
  tree_id: string
  rainfall_in_mm: number
}
/**
 * Fetches the rain data for a tree (in mm for the current day).
 * @param treeId string
 * @returns Promise<TreeRainAmountType[] | undefined>
 */
export const getTreeRainAmount = async (
  treeId: string
): Promise<TreeRainAmountType | undefined> => {
  if (!treeId) return
  const response = await fetch(`/rainfall.json`)
  if (!response.ok) {
    const txt = await response.text()
    console.error(txt)
    throw new Error(txt)
  }
  const rainfallData = (await response.json()) as RainfallData[]

  const rainfallForTree = rainfallData.find(
    (rainfall: RainfallData) => rainfall.tree_id === treeId
  )

  return rainfallForTree?.rainfall_in_mm
}
