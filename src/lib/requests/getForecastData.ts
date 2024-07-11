/**
 * According to the database schema all values except id are nullable.
 */
export type ForecastDataType = {
  id: number
  /** `tree_id? is what `id` is in the the trees table.
   * (Unfortunately it is marked as nullable in the database schema)
   */
  tree_id?: string
  /** 1 = value for 30cm depth.
   *  2 = value for 60cm depth.
   *  3 = value for 90cm depth.
   *  4 = value for average.
   */
  type_id?: number
  timestamp?: string
  value?: number
  created_at?: string
  model_id?: string
}

/**
 * Fetches the forecast data for a tree (maximum 14 days).
 * @param treeId string
 * @returns Promise<ForecastDataType[] | undefined>
 */
export const getForecastData = async (
  treeId: string
): Promise<ForecastDataType[] | undefined> => {
  if (!treeId) return

  const response = await fetch(`/forecast.json`)
  const forecasts = (await response.json()) as ForecastDataType[]
  const forecastsForTree = forecasts.filter(
    (forecast: ForecastDataType) => forecast.tree_id === treeId
  )
  if (forecastsForTree) {
    return forecastsForTree
  }
}
