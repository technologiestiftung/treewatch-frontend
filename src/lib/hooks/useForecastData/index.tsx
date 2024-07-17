import {
  getForecastData,
  ForecastDataType,
} from '@lib/requests/getForecastData'
import useSWR from 'swr'

interface useForecastDataReturnType {
  isLoading: boolean
  data: ForecastDataType[] | null
  error: Error | null
}

export const useForecastData = (
  treeId: string | undefined
): useForecastDataReturnType => {
  const params = [`Forecast - Tree ID - ${treeId || 'nodata'}`]
  const { data, error } = useSWR<ForecastDataType[] | undefined, Error>(
    params,
    () => (treeId ? getForecastData(treeId) : undefined)
  )

  return {
    isLoading: !data && !error,
    data: data && data.length > 0 ? data : null,
    error: error || null,
  }
}
