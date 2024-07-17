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

// export const WATER_SUPPLY_STATUSES: WaterSupplyStatusType[] = [
//   {
//     suctionTensionRange: [0, 33],
//     label: 'Gut',
//     id: 'good',
//   },
//   {
//     suctionTensionRange: [33, 81],
//     label: 'Mäßig',
//     id: 'medium',
//   },
//   {
//     suctionTensionRange: [81, 270],
//     label: 'Kritisch',
//     id: 'critical',
//   },
// ]

/**
 * Fetches the forecast data for a tree (maximum 14 days).
 * 2024-07-11: This project is about to be archived.
 * For archiving purposes, we make the project independent of the backend, database and vector tiles.
 * The forecast data generated here is random.
 * @param treeId string
 * @returns Promise<ForecastDataType[] | undefined>
 */
export const getForecastData = (treeId: string): ForecastDataType[] => {
  if (!treeId) return []

  const today = new Date()
  const forecasts: ForecastDataType[] = []

  for (let i = 0; i < 14; i++) {
    const timestamp = new Date(
      today.getTime() + i * 24 * 60 * 60 * 1000
    ).toISOString()

    let randomValue = Math.random() * 270
    if (i > 0) {
      const last = forecasts[i - 1]
      const lastValue = last.value || 0
      if (lastValue <= 33) {
        randomValue = Math.random() * 81
      }
    }

    const forecast: ForecastDataType = {
      id: 0,
      timestamp: timestamp,
      tree_id: treeId,
      type_id: 4,
      value: randomValue,
      created_at: new Date().toISOString(),
      model_id: 'Random Forest (simple)',
    }
    forecasts.push(forecast)
  }

  return forecasts
}
