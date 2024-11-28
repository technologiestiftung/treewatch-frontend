import { News, Plant, Plus } from '@components/Icons'
import { StoriesOverviewHeader } from '@components/StoriesOverviewHeader'
import { StoryLink, StoryLinkPropType } from '@components/StoryLink'
import { GetServerSideProps } from 'next'
import { FC } from 'react'

export const stories: Record<string, StoryLinkPropType> = {
  verschattung: {
    path: `/stories/verschattung`,
    title: `Die Verschattung als Einflussfaktor für das Vorhersagemodell`,
    author: `Birds on Mars`,
    readingDurationInMinutes: 3,
    excerpt: (
      <>
        Warum ist die Verschattung eines Baumes so wichtig für dessen
        Wasserbedarf?
      </>
    ),
    Icon: Plus,
  },
  'saugspannung-und-sensoren': {
    path: `/stories/saugspannung-und-sensoren`,
    title: `Über Saugspannung und Sensoren`,
    author: `ARBOR revital`,
    readingDurationInMinutes: 3,
    excerpt: (
      <>
        Was genau ist eine Saugspannung und welche Sensoren nutzt die Stadt
        Berlin bereits?
      </>
    ),
    Icon: Plant,
  },
  'richtig-giessen': {
    path: `/stories/richtig-giessen`,
    title: `Wie gieße ich einen Baum richtig?`,
    author: `Grünflächenamt Berlin Mitte`,
    readingDurationInMinutes: 3,
    excerpt: (
      // eslint-disable-next-line react/no-unescaped-entities
      <>Wie gieße ich eine Baum richtig und: kann ich auf 'falsch' gießen?</>
    ),
    Icon: Plant,
  },
  'qtrees-konsortium': {
    path: `/stories/qtrees-konsortium`,
    title: `Das Team hinter der Baumblick App`,
    author: `Technologiestiftung Berlin`,
    readingDurationInMinutes: 4,
    excerpt: (
      <>Das Konsortium: wer steckt hinter Quantified Trees und Baumblick?</>
    ),
    Icon: News,
  },
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: {
    title: 'Stories',
    query,
  },
})

export const Stories: FC = () => (
  <div className="max-w-screen-md mx-auto">
    <StoriesOverviewHeader />
    {Object.values(stories).map((story) => (
      <StoryLink {...story} key={story.path} />
    ))}
  </div>
)

export default Stories
