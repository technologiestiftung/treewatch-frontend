import classNames from 'classnames'
import { FC } from 'react'
import { Check as CheckIcon } from '@components/Icons'
import colors from 'src/style/colors'
import useTranslation from 'next-translate/useTranslation'

export const FeedbackConfirmation: FC = () => {
  const { t } = useTranslation('common')

  return (
    <div
      className={classNames(
        'grid grid-cols-[1fr,24px] gap-x-6',
        'col-span-2 mr-6',
        'mt-4'
      )}
    >
      <h4 className="font-bold">{t('feedback.demoTitle')}</h4>
      <div className="row-span-2 flex items-center">
        <CheckIcon color1={colors.scale['good']} />
      </div>
      <p className="font-serif text-gray-500">
        {t('feedback.demoDescription')}
      </p>
    </div>
  )
}
