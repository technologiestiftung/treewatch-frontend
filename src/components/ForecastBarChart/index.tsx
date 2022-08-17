import { getScaleClassesByLevel } from '@lib/utils/getScaleClassesByLevel'
import { SuctionTensionLevel } from '@lib/utils/mapSuctionTensionToLevel'
import classNames from 'classnames'
import { format } from 'date-fns'
import { FC } from 'react'

interface DataItem {
  suctionTensionLevel: SuctionTensionLevel
  date: string
}

export interface ForecastBarChartPropType {
  data?: DataItem[]
}

const SUCTION_TENSION_LEVELS: SuctionTensionLevel[] = [1, 2, 3, 4, 5]

const GRID_BASE_CLASSES = classNames(
  'absolute top-0 left-0',
  'w-full h-full px-2',
  'grid gap-x-[2px] gap-y-0'
)

export const ForecastBarChart: FC<ForecastBarChartPropType> = ({ data }) => {
  const MAX_Y_VALUE = 5 // Max suction tension

  const GRID_AXES_CLASSES = {
    gridTemplateColumns: `repeat(${data?.length || 1}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${MAX_Y_VALUE}, minmax(0, 1fr))`,
  }

  return (
    <div
      className={classNames(
        'w-full h-full',
        'pt-3',
        'bg-white',
        'grid grid-cols-[auto,1fr] gap-0'
      )}
    >
      <div
        className="w-full grid grid-cols-1 gap-0 justify-center"
        style={{ gridTemplateRows: `repeat(${MAX_Y_VALUE}, minmax(0, 1fr))` }}
      >
        {SUCTION_TENSION_LEVELS.reverse().map((level) => {
          return (
            <span
              key={`suction-tension-level-${level}`}
              className={classNames(
                ' px-2',
                '-translate-y-3',
                'text-gray-900 text-opacity-50 font-semibold'
              )}
            >
              {level}
            </span>
          )
        })}
      </div>
      <div className={classNames('relative w-full h-full overflow-x-visible')}>
        <div className={GRID_BASE_CLASSES} style={{ ...GRID_AXES_CLASSES }}>
          {SUCTION_TENSION_LEVELS.reverse().map((level) => {
            return (
              <div
                key={`suction-tension-axis-level-${level}`}
                className="w-[calc(100%+16px)] -translate-x-[8px] border-t border-gray-200"
                style={{
                  gridColumn: `span ${data?.length || 1}`,
                  gridRow: level,
                }}
              ></div>
            )
          })}
        </div>
        {data && (
          <div className={GRID_BASE_CLASSES} style={{ ...GRID_AXES_CLASSES }}>
            {data.map((dataItem) => {
              return (
                <div
                  key={dataItem.date}
                  className={classNames(
                    'relative flex justify-center items-end',
                    'overflow-hidden',
                    'row-start-[-1]',
                    getScaleClassesByLevel(dataItem.suctionTensionLevel).bg
                  )}
                  style={{ gridRowEnd: -(dataItem.suctionTensionLevel + 1) }}
                >
                  <span className="pl-0 absolute bottom-0 text-gray-900 text-opacity-50 font-semibold -rotate-90 -translate-y-4 origin-center whitespace-nowrap">
                    {format(new Date(dataItem.date), 'dd.MM.')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
