import {
  SUPABASE_ANON_KEY,
  SUPABASE_PASSTHROUGH_API_URL,
} from '@lib/utils/envUtil'

/**
 * According to the database schema all values except id are nullable.
 */
export type NowcastDataType = {
  id: number
  /** `baum_id? is what `gml_id` is in the the trees table.
   * (Unfortunately it is marked as nullable in the database schema)
   */
  baum_id?: string
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

const TABLE_NAME = 'nowcast'
const TREE_ID_COLUMN_NAME = 'baum_id'
const COLUMN_TO_SORT_BY = 'timestamp'

const REQUEST_OPTIONS = {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  },
}

/**
 * Fetches the most recent nowcast data for a tree.
 * @param treeId string
 * @returns Promise<NowcastDataType[] | undefined>
 */
export const getNowcastData = async (
  treeId: string
): Promise<NowcastDataType[] | undefined> => {
  if (!treeId) return

  const REQUEST_URL = `${SUPABASE_PASSTHROUGH_API_URL}/${TABLE_NAME}`

  const REQUEST_PARAMS = new URLSearchParams({
    [TREE_ID_COLUMN_NAME]: `eq.${treeId}`,
    order: `${COLUMN_TO_SORT_BY}`,
    limit: '4',
    offset: '0',
  })

  const response = await fetch(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${REQUEST_URL}?${REQUEST_PARAMS}`,
    REQUEST_OPTIONS
  )

  if (!response.ok) {
    const txt = await response.text()
    console.error(txt)
    throw new Error(txt)
  }

  const data = (await response.json()) as NowcastDataType[]

  return data
}
