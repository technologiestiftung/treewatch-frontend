import { getIssueTypesData } from '@lib/requests/getIssueTypesData'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const LOCAL_STORAGE_PREFIX = 'issue'

export interface IssueTypeType {
  id: number
  title: string
  description: string
  imageUrl: string | null
  alreadyReported: boolean
}

type UseFeedbackDataType = (treeId: string | undefined) => {
  issues: IssueTypeType[] | null
  isLoading: boolean
  error: string | null
  reportIssue: (issueTypeId: number) => Promise<void>
}

const getIssueTypes = async (treeId: string): Promise<IssueTypeType[]> => {
  const data = await getIssueTypesData()

  if (!data || data.length === 0) throw new Error('No issu types found!')
  return data.map((issueTypeType) => ({
    ...issueTypeType,
    imageUrl: issueTypeType.image_url || null,
    alreadyReported: getIfAlreadyReported(issueTypeType.id, treeId),
  }))
}

const addLeadingZeros = (n: number): string => {
  if (n <= 9) return `0${n}`
  return `${n}`
}

const formatDate = (d: Date = new Date()): string =>
  [
    d.getFullYear(),
    '-',
    addLeadingZeros(d.getMonth() + 1),
    '-',
    addLeadingZeros(d.getDate()),
  ].join('')

const cleanLocalStorage = (): void => {
  if (typeof window === 'undefined') return
  const localStorageIssues = Object.keys(localStorage).filter((key) =>
    key.startsWith(`${LOCAL_STORAGE_PREFIX}-`)
  )
  localStorageIssues.forEach((key) => {
    const itemTimestamp = window.localStorage.getItem(key)
    if (itemTimestamp) {
      const date = new Date(itemTimestamp)
      const dateToday = new Date(formatDate())
      if (date > dateToday) return
      window.localStorage.removeItem(key)
    }
  })
}

const getLocalStorageKey = (treeId: string, issueTypeId: number): string =>
  `${LOCAL_STORAGE_PREFIX}-${treeId}-${issueTypeId}`

const getIfAlreadyReported = (
  issueTypeId: number,
  treeId: string | undefined
): boolean => {
  if (!treeId) return false
  const lsItem = window.localStorage.getItem(
    getLocalStorageKey(treeId, issueTypeId)
  )
  if (!lsItem) return false
  const date = new Date(lsItem)
  const dateToday = new Date(formatDate())
  if (date > dateToday) return true
  return false
}

export const useFeedbackData: UseFeedbackDataType = (treeId) => {
  const {
    data,
    error: sdkError,
    mutate,
  } = useSWR<IssueTypeType[] | undefined, Error>(
    `feedback_data${!treeId ? '-nodata' : ''}`,
    async () => {
      if (!treeId) return undefined
      setIssueError(null)
      return getIssueTypes(treeId)
    }
  )
  const [issueError, setIssueError] = useState<string | null>(null)

  useEffect(() => {
    cleanLocalStorage()
  }, [])

  return {
    issues:
      data?.map((item) => ({
        ...item,
        alreadyReported: getIfAlreadyReported(item.id, treeId),
      })) || null,
    isLoading: data === null,
    error: issueError || sdkError?.message || null,
    reportIssue: async (issueTypeId: number): Promise<void> => {
      if (!treeId) return
      setIssueError(null)
      try {
        // await reportIssue({ issueTypeId, treeId, csrfToken })
        window.localStorage.setItem(
          getLocalStorageKey(treeId, issueTypeId),
          new Date().toISOString()
        )
        void mutate()
      } catch (error) {
        setIssueError((error as Error).message)
        return
      }
    },
  }
}
