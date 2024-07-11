import { ReactElement, ReactNode } from 'react'
import { MapLayout } from '@layouts/MapLayout'
import classNames from 'classnames'
import { GetServerSideProps, NextPage } from 'next'
import { TreeDataType } from '@lib/requests/getTreeData'
import { useNowcastData } from '@lib/hooks/useNowcastData'
import { TreeInfoHeader } from '@components/TreeInfoHeader'
import { mapSuctionTensionToStatus } from '@lib/utils/mapSuctionTensionToStatus'
import { GroundLayersViz } from '@components/GroundLayersViz'
import { useRouter } from 'next/router'
import { Cross as CrossIcon, Gdk as GdkIcon } from '@components/Icons'
import { useHasScrolledPastThreshold } from '@lib/hooks/useHasScrolledPastThreshold'
import { Carousel } from '@components/Carousel'
import { Tabs } from '@components/Tabs'
import useTranslation from 'next-translate/useTranslation'
import { getClassesByStatusId } from '@lib/utils/getClassesByStatusId'
import { treeUrlSlugToId } from '@lib/utils/urlUtil'
import { ForecastViz } from '@components/ForecastViz'
import { FeedbackRequestsList } from '@components/FeedbackRequestsList'
import csrf from '@lib/api/csrf'
import { useForecastData } from '@lib/hooks/useForecastData'
import { mapForecastDataToMinimum } from '@lib/utils/forecastUtil/forecastUtil'
import { useTreeRainAmount } from '@lib/hooks/useTreeRainAmount'
import { useTreeData } from '@lib/hooks/useTreeData'
import { mapRawQueryToState } from '@lib/utils/queryUtil'
import { Head } from '@components/Head'
import { ParkTreeHint } from '@components/ParkTreeHint'
import { useShadingData } from '@lib/hooks/useShadingData'
import { useWateringData } from '@lib/hooks/useWateringData'
import { TreeInfoList } from '@components/TreeInfoList'
import { Button } from '@components/Button'
import { useGdkTreeId } from '@lib/hooks/useGdkTreeId'
import { ImageCard } from '@components/ImageCard'
import colors from 'src/style/colors'
import { calculateAge } from '@lib/utils/calculateAge'

interface TreePageComponentPropType {
  treeId: TreeDataType['id']
  csrfToken: string
  query?: ReturnType<typeof mapRawQueryToState>
}

type TreePageWithLayout = NextPage<TreePageComponentPropType> & {
  getLayout?: (
    page: ReactElement,
    props: TreePageComponentPropType
  ) => ReactNode
}

type CsrfTokenType = string

export const getServerSideProps: GetServerSideProps<
  TreePageComponentPropType
> = async ({ params, query, req, res }) => {
  try {
    await csrf(req, res)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const csrfToken = req.csrfToken() as CsrfTokenType

    const treeId =
      typeof params?.id === 'string' ? treeUrlSlugToId(params.id) : null

    if (!treeId || Array.isArray(treeId)) return { notFound: true }

    return {
      props: {
        csrfToken,
        treeId,
        query,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}

const TreePage: TreePageWithLayout = ({ treeId, csrfToken }) => {
  const { t } = useTranslation('common')
  const { push } = useRouter()
  const { hasScrolledPastThreshold } = useHasScrolledPastThreshold({
    threshold: 450,
  })

  const {
    data: treeData,
    error: treeDataError,
    isLoading: treeDataLoading,
  } = useTreeData(treeId)

  console.log(treeData)

  const {
    data: nowcastData,
    error: nowcastError,
    isLoading: nowcastIsLoading,
  } = useNowcastData(treeData?.id)

  console.log(nowcastData)

  const {
    data: shadingData,
    error: shadingError,
    isLoading: shadingIsLoading,
  } = useShadingData(treeData?.id)

  const { data: forecastData, error: forecastError } = useForecastData(
    treeData?.id
  )

  const { data: gdkTreeId, isLoading: gdkTreeIdIsLoading } = useGdkTreeId(
    treeData?.id
  )

  const {
    data: rainData,
    error: rainError,
    isLoading: rainIsLoading,
  } = useTreeRainAmount(treeData?.id)

  const {
    data: wateringData,
    error: wateringDataError,
    isLoading: wateringDataIsLoading,
  } = useWateringData(treeData?.id, csrfToken)

  if (treeDataError) {
    void push('/404')
    return null
  }

  const avgLevel =
    nowcastData && nowcastData.depthAverageRow?.value
      ? mapSuctionTensionToStatus(nowcastData.depthAverageRow?.value)?.id
      : undefined
  const circleColorClasses = getClassesByStatusId(avgLevel)

  const nowcastReady = forecastData && forecastData?.length > 0
  const forecastReady = nowcastData
  const forecast =
    nowcastReady && forecastReady
      ? mapForecastDataToMinimum(forecastData)
      : undefined

  return (
    <div id="inidividual-tree-container">
      {treeData?.art_dtsch && <Head pageTitle={treeData.art_dtsch} />}
      <div
        className={classNames(
          'max-w-3xl mx-auto',
          'grid grid-cols-1 grid-rows-[148px,1fr] gap-0'
        )}
      >
        <button
          className={classNames(
            'row-start-1 row-span1',
            'relative',
            'group focus:outline-none'
          )}
          onClick={() => {
            void push({
              pathname: '/trees',
              query: { latitude: treeData?.lat, longitude: treeData?.lng },
            })
          }}
          aria-label={t(`treeView.mapAriaLabel`)}
        >
          <div
            className={classNames(
              'absolute top-2 lg:top-[69px] right-2',
              'p-2 bg-white rounded-full shadow-md hover:bg-gray-100',
              'border border-gray-300',
              'group-focus:ring-2 group-focus:ring-gray-900 group-focus:ring-offset-2',
              'group-focus:ring-offset-white'
            )}
          >
            <CrossIcon className="w-8 h-8" />
          </div>
        </button>
        <div
          className={classNames(
            'bg-white rounded-t-2xl',
            'md:border-l md:border-r border-gray-200',
            'row-start-2 row-span-1',
            'grid grid-cols-1 grid-rows-auto',
            'motion-safe:animate-slide-up',
            'mt-12 lg:mt-0'
          )}
        >
          <div
            className={classNames(
              'w-full sticky top-0',
              'overflow-hidden rounded-t-2xl',
              'shadow-[0_-12px_24px_-16px_rgba(0,0,0,0.3)]'
            )}
          >
            {treeData?.street_tree && (
              <Carousel dotsClass="slick-dots w-2/6 md:w-1/4 mx-auto">
                {!nowcastError && (
                  <GroundLayersViz
                    depth30StatusId={
                      nowcastData && nowcastData.depth30Row?.value
                        ? mapSuctionTensionToStatus(
                            nowcastData.depth30Row?.value
                          )?.id
                        : undefined
                    }
                    depth60StatusId={
                      nowcastData && nowcastData.depth60Row?.value
                        ? mapSuctionTensionToStatus(
                            nowcastData.depth60Row?.value
                          )?.id
                        : undefined
                    }
                    depth90StatusId={
                      nowcastData && nowcastData.depth90Row?.value
                        ? mapSuctionTensionToStatus(
                            nowcastData.depth90Row?.value
                          )?.id
                        : undefined
                    }
                    averageStatusId={avgLevel}
                  />
                )}
                {!forecastError && <ForecastViz data={forecast} />}
              </Carousel>
            )}
            {!treeDataLoading && !treeData?.street_tree && <ParkTreeHint />}
          </div>
          <TreeInfoHeader
            species={
              treeDataLoading
                ? t('loading')
                : treeData?.art_dtsch || 'Unbekannte Art'
            }
            age={calculateAge(treeData?.pflanzjahr)}
            height={treeData?.baumhoehe}
            statusBackgroundColor={circleColorClasses.bg}
            statusBorderColor={circleColorClasses.border}
          />
          <div
            className={classNames(
              'fixed w-screen top-0 z-50 border-gray-300 pointer-events-none',
              'transition-all',
              hasScrolledPastThreshold
                ? ' opacity-1 shadow-lg border-b'
                : 'opacity-0'
            )}
          >
            <TreeInfoHeader
              species={
                !treeDataLoading && treeData
                  ? treeData?.art_dtsch || 'Unbekannte Art'
                  : '–'
              }
              age={calculateAge(treeData?.pflanzjahr)}
              height={treeData?.baumhoehe}
              statusBackgroundColor={circleColorClasses.bg}
              statusBorderColor={circleColorClasses.border}
              isCompressed={hasScrolledPastThreshold}
            />
          </div>
          <Tabs
            tabs={[
              {
                name: t('treeView.tabs.0'),
                content: (
                  <TreeInfoList
                    treeData={treeData}
                    treeDataIsLoading={treeDataLoading}
                    treeDataError={treeDataError}
                    nowcastData={nowcastData}
                    nowcastError={nowcastError}
                    nowcastIsLoading={nowcastIsLoading}
                    rainData={rainData}
                    rainError={rainError}
                    rainIsLoading={rainIsLoading}
                    shadingData={shadingData}
                    shadingError={shadingError}
                    shadingIsLoading={shadingIsLoading}
                    wateringData={wateringData}
                    wateringDataError={wateringDataError}
                    wateringDataIsLoading={wateringDataIsLoading}
                  />
                ),
              },
              {
                name: t('treeView.tabs.1'),
                content: (
                  <div className="pt-8 relative bg-white">
                    {!gdkTreeIdIsLoading && gdkTreeId && (
                      <ImageCard
                        title={t('gdk.title')}
                        description={t('gdk.description')}
                        imageUrl="/images/giessdenkiez_watering.webp"
                      >
                        <Button
                          primary
                          href={`https://giessdenkiez.de/tree/${gdkTreeId}`}
                        >
                          <GdkIcon
                            color1={colors.white}
                            color2={colors.gray['700']}
                          />
                          {t('gdk.cta')}
                        </Button>
                      </ImageCard>
                    )}
                    <FeedbackRequestsList
                      treeData={treeData || undefined}
                      csrfToken={csrfToken}
                      className="pl-6 pb-6"
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

TreePage.getLayout = function getLayout(page, props) {
  return (
    <>
      <MapLayout
        isMinimized={true}
        treeIdToSelect={props.treeId}
        latitude={props.query?.latitude || undefined}
        longitude={props.query?.longitude || undefined}
      />
      {page}
    </>
  )
}

export default TreePage
