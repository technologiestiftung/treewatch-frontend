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

  const today = new Date()
  const forecasts: ForecastDataType[] = []

  for (let i = 0; i < 14; i++) {
    const timestamp = new Date(
      today.getTime() + i * 24 * 60 * 60 * 1000
    ).toISOString()
    const forecast: ForecastDataType = {
      id: 0,
      timestamp: timestamp,
      tree_id: treeId,
      type_id: 4,
      value: Math.random() * 270,
      created_at: new Date().toISOString(),
      model_id: 'Random Forest (simple)',
    }
    forecasts.push(forecast)
  }

  return forecasts
}
