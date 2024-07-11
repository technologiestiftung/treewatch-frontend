import { MappedNowcastRowsType } from '@lib/utils/mapRowsToDepths'
import useSWR from 'swr'
import { TreeGeoJsonFeature, TreesGeoJson } from '../useTreeData'

interface useNowcastDataReturnType {
  isLoading: boolean
  data: MappedNowcastRowsType | null
  error: Error | null
}

/**
 * Fetches the current nowcast data for a tree.
 * 2024-07-11: This project is about to be archived.
 * For archiving purposes, we make the project independent of the backend, database and vector tiles.
 * The nowcast data is taken from the static trees.geojson file.
 * @param treeId string
 * @returns Promise<MappedNowcastRowsType>
 */
export const useNowcastData = (
  treeId: string | undefined
): useNowcastDataReturnType => {
  async function fetchData(): Promise<MappedNowcastRowsType> {
    const response = await fetch(`/trees.geojson`)
    const trees = (await response.json()) as TreesGeoJson
    const foundTree = trees.features.find(
      (tree: TreeGeoJsonFeature) => tree.properties.trees_id === treeId
    )
    if (!foundTree) {
      return {
        depth30Row: { value: undefined },
        depth60Row: { value: undefined },
        depth90Row: { value: undefined },
        depthAverageRow: { value: undefined },
      } as MappedNowcastRowsType
    }
    return {
      depth30Row: {
        value: foundTree.properties.nowcast_values_30cm,
      },
      depth60Row: {
        value: foundTree.properties.nowcast_values_60cm,
      },
      depth90Row: {
        value: foundTree.properties.nowcast_values_90cm,
      },
      depthAverageRow: {
        value: foundTree?.properties.nowcast_values_stamm,
      },
    } as MappedNowcastRowsType
  }

  const params = [`Nowcast - Tree ID - ${treeId || 'nodata'}`]
  const { data, error } = useSWR<MappedNowcastRowsType | undefined, Error>(
    params,
    () => (treeId ? fetchData() : undefined)
  )

  return {
    isLoading: !data && !error,
    data: data || null,
    error: error || null,
  }
}
