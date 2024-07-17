import { Database } from '@lib/types/database'

type IssueTypesDataType = Database['public']['Tables']['issue_types']['Row']
export const getIssueTypesData = async (): Promise<
  IssueTypesDataType[] | undefined
> => {
  const response = await fetch(`/issue_types.json`)
  const issueTypes = (await response.json()) as IssueTypesDataType[]
  return issueTypes
}
