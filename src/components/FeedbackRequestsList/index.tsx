import { Button } from '@components/Button'
import { FeedbackReportModal } from '@components/FeedbackReportModal'
import { ImageCard } from '@components/ImageCard'
import { IssueTypeType, useFeedbackData } from '@lib/hooks/useFeedbackData'
import { TreeDataType } from '@lib/requests/getTreeData'
import useTranslation from 'next-translate/useTranslation'
import { FC, useState } from 'react'
import { FeedbackConfirmation } from './FeedbackConfirmation'

interface FeedbackRequestsListPropType {
  treeData: TreeDataType | undefined
  csrfToken: string
  className?: string
}

export const FeedbackRequestsList: FC<FeedbackRequestsListPropType> = ({
  treeData,
}) => {
  const { t } = useTranslation('common')
  const { issues, reportIssue, isLoading, error } = useFeedbackData(
    treeData?.id
  )
  const [openedIssueModal, setOpenedIssueModal] =
    useState<IssueTypeType | null>(null)

  return (
    <div className="relative bg-white z-0">
      {!error &&
        issues?.map((issueType) => (
          <ImageCard
            key={issueType.id}
            title={issueType.title}
            description={issueType.description}
            imageUrl={issueType.imageUrl || ''}
          >
            {issueType.alreadyReported ? (
              <FeedbackConfirmation />
            ) : (
              <Button primary onClick={() => setOpenedIssueModal(issueType)}>
                {t('feedback.reportButton', { title: issueType.title })}
              </Button>
            )}
          </ImageCard>
        ))}
      <FeedbackReportModal
        title={openedIssueModal?.title || ' '}
        address={
          (treeData?.strname &&
            treeData?.hausnr &&
            treeData?.bezirk &&
            `${treeData?.strname} ${treeData?.hausnr}, ${treeData?.bezirk}`) ||
          ''
        }
        imageUrl={openedIssueModal?.imageUrl}
        treeName={treeData?.art_dtsch || 'Baum'}
        isOpen={!!openedIssueModal}
        onConfirm={() => {
          if (!openedIssueModal) return
          setOpenedIssueModal(null)
          void reportIssue(openedIssueModal.id)
        }}
        onClose={() => setOpenedIssueModal(null)}
      />
      {isLoading && (
        <div className="p-8 font-serif md:text-lg">{t('feedback.loading')}</div>
      )}
      {error && (
        <div className="p-8 font-serif md:text-lg">
          {t('feedback.error')}
          <br />
          <span className="font-mono bg-gray-100 px-2 py-1 -ml-2 mt-2 inline-block">
            {error}
          </span>
        </div>
      )}
    </div>
  )
}
