import classNames from 'classnames'
import { DOMAttributes, FC } from 'react'

const scaleClasses = [
  'border-scale-1',
  'border-scale-2',
  'border-scale-3',
  'border-scale-4',
  'border-scale-5',
  'border-scale-6',
  'border-scale-7',
  'border-scale-8',
]

interface ChapterType {
  title: string
}

export interface TableOfContentsPropType {
  chapters: ChapterType[]
  onChapterClick?: (title: ChapterType['title']) => void
  activeChapterTitle?: string
}

interface ChapterLinkPropType extends ChapterType {
  onClick: TableOfContentsPropType['onChapterClick']
  colorClass: string
  isActive?: boolean
}

const ChapterLink: FC<ChapterLinkPropType> = ({
  title,
  onClick = () => undefined,
  colorClass = scaleClasses[0],
  isActive = false,
}) => {
  const onChapterClick: DOMAttributes<HTMLElement>['onClick'] = (evt) => {
    evt.preventDefault()
    onClick(title)
  }
  const onKeyUp: DOMAttributes<HTMLElement>['onKeyUp'] = (evt) => {
    if (evt.key !== 'enter') return
    evt.preventDefault()
    onClick(title)
  }

  const wrapperStyles = classNames('block')
  const linkStyles = classNames(
    colorClass,
    'py-1 block transition-all',
    'hover:text-gray-900 text-left',
    'hover:border-l-8 hover:pl-5',
    isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-600',
    isActive ? 'border-l-[12px] pl-4' : 'border-l-4 pl-6'
  )

  return (
    <li className={wrapperStyles}>
      <button onClick={onChapterClick} onKeyUp={onKeyUp} className={linkStyles}>
        {title}
      </button>
    </li>
  )
}

export const TableOfContents: FC<TableOfContentsPropType> = ({
  chapters,
  onChapterClick = () => undefined,
  activeChapterTitle,
}) => (
  <ul className={classNames()}>
    {chapters.map((chapter, idx) => (
      <ChapterLink
        key={chapter.title}
        {...chapter}
        onClick={onChapterClick}
        isActive={chapter.title === activeChapterTitle}
        colorClass={scaleClasses[Math.min(idx, scaleClasses.length - 1)]}
      />
    ))}
  </ul>
)
