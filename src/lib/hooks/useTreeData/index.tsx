import { TreeDataType } from '@lib/requests/getTreeData'
import useSWR from 'swr'

type UseTreeDataType = (treeid: string | undefined) => {
  data: TreeDataType | null
  isLoading: boolean
  error: Error | null
}

interface TreeGeoJsonFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[]
  }
  properties: {
    trees_id: string
    nowcast_values_stamm: number
    trees_lat: number
    trees_lng: number
    baumscheibe_m2: number
    trees_stammumfg: number
  }
}

interface TreesGeoJson {
  type: string
  features: TreeGeoJsonFeature[]
}

export const useTreeData: UseTreeDataType = (treeId) => {
  async function fetchData(): Promise<TreeDataType> {
    const response = await fetch(`/trees.geojson`)

    const trees = (await response.json()) as TreesGeoJson

    const foundTree = trees.features.find(
      (tree: TreeGeoJsonFeature) => tree.properties.trees_id === treeId
    )

    return {
      baumscheibe: foundTree?.properties.baumscheibe_m2,
      id: foundTree?.properties.trees_id,
      lat: foundTree?.properties.trees_lat,
      lng: foundTree?.properties.trees_lng,
      stammumfg: foundTree?.properties.trees_stammumfg,
      street_tree: true,
      art_bot: null,
      art_dtsch: null,
      baumhoehe: null,
      bezirk: null,
      created_at: null,
      eigentuemer: null,
      gattung: null,
      gattung_deutsch: null,
      geometry: null,
      hausnr: null,
      kennzeich: null,
      kronedurch: null,
      namenr: null,
      pflanzjahr: null,
      standalter: null,
      standortnr: null,
      strname: null,
      updated_at: null,
      zusatz: null,
    } as TreeDataType
  }

  const { data, error } = useSWR<TreeDataType | undefined, Error>(
    `tree_data${treeId ? treeId : 'nodata'}`,
    () => (treeId ? fetchData() : undefined)
  )

  return {
    data: data as TreeDataType,
    isLoading: false,
    error: error || null,
  }
}
