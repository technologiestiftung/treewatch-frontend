import { getWateringValue } from '@lib/requests/getWateringValue'
import useSWR from 'swr'

export interface useWateringDataReturnType {
  isLoading: boolean
  data: number | null
  error: Error | null
}

export const useWateringData = (
  treeId: string | undefined
): useWateringDataReturnType => {
  const params = [`Watering - Tree ID - ${treeId || 'nodata'}`]
  const { data, error } = useSWR<number | undefined, Error>(params, () =>
    treeId ? getWateringValue(treeId) : undefined
  )

  return {
    isLoading: !data && !error,
    data: data || null,
    error: error || null,
  }
}
