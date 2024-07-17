import classNames from 'classnames'
import { FC, useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import ReactDOM from 'react-dom'
import { Pill } from '@components/Pill'
import { getClassesByStatusId } from '@lib/utils/getClassesByStatusId'
import { WaterSupplyStatusType } from '@lib/utils/mapSuctionTensionToStatus'
import { Button } from '@components/Button'

export interface WaterSupplyLegendType {
  hasShadow?: boolean
  className?: string
  showNoDataItem?: boolean
  onExplainLegend?: () => void
}

export const WaterSupplyLegend: FC<WaterSupplyLegendType> = ({
  hasShadow = false,
  className = '',
  showNoDataItem = false,
  onExplainLegend = () => undefined,
  children,
}) => {
  const { t } = useTranslation('common')
  const [bodyNode, setBodyNode] = useState<HTMLElement | null>(null)

  const levels = t('legend.map.levels', {}, { returnObjects: true })

  useEffect(() => {
    const domNode = document.querySelector('body')
    if (!domNode) return
    setBodyNode(domNode)
  }, [])

  if (!bodyNode) return null

  return ReactDOM.createPortal(
    <div className="fixed w-full left-0 top-2 lg:bottom-4 lg:top-auto pointer-events-none">
      <div className="w-full">
        <div
          className={classNames(
            className,
            'group ml-2 lg:ml-4 pointer-events-auto',
            'inline-block',
            'w-[176px] min-w-[80px]',
            'py-2 px-3',
            'bg-white',
            'rounded border border-gray-300',
            'flex flex-wrap place-content-between gap-1',

            hasShadow && 'shadow-md'
          )}
        >
          <div className="w-full flex gap-x-2 items-baseline">
            <h2 className="text-sm font-semibold">{t('legend.map.title')} </h2>
            <Button
              className="px-1 py-0 text-xs text-gray-500"
              onClick={() => onExplainLegend()}
            >
              ?
            </Button>
          </div>
          <ul>
            {Object.entries(levels)
              .filter(([id]) => id !== 'unknown')
              .map(([id, label]) => {
                return (
                  <li
                    key={id}
                    className={classNames(
                      'mt-1 first-of-type:mt-0',
                      'flex gap-2 items-center'
                    )}
                  >
                    <Pill
                      className={classNames(
                        'border',
                        Object.values(
                          getClassesByStatusId(
                            id as WaterSupplyStatusType['id']
                          )
                        )
                      )}
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      {label}
                    </span>
                  </li>
                )
              })}
            {showNoDataItem && (
              <li
                key={`no-data-item`}
                className={classNames(
                  'mt-1 first-of-type:mt-0',
                  'flex gap-2 items-center'
                )}
              >
                <Pill
                  className={classNames('border bg-white border-gray-400')}
                />
                <span className="text-xs font-semibold text-gray-800">
                  {t('legend.map.levels.unknown')}
                </span>
              </li>
            )}
          </ul>
          {children}
        </div>
      </div>
      {
        // 2024-07-11: This project is about to be archived.
        // For archiving purposes, we render a hint for the user that the data is demo data.
      }
      <div className="w-full mt-2">
        <div
          className={classNames(
            className,
            'text-xs',
            'ml-2 lg:ml-4 pointer-events-auto',
            'w-[176px] min-w-[80px]',
            'py-2 px-3',
            'bg-white',
            'rounded border border-gray-300',
            'shadow-md'
          )}
        >
          <span className="font-bold">{t('legend.demoDataTitle')}</span>{' '}
          {t('legend.demoDataHint')}
        </div>
      </div>
    </div>,
    bodyNode
  )
}
