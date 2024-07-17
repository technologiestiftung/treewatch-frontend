import { GdkTreeIdReturnType } from '@lib/requests/getGdkTreeId'

export interface useGdkTreeIdReturnType {
  isLoading: boolean
  data: GdkTreeIdReturnType['id'] | null
  error: Error | null
}

export const useGdkTreeId = (
  treeId: string | undefined
): useGdkTreeIdReturnType => {
  return {
    isLoading: false,
    data: treeId || null,
    error: null,
  }
}
