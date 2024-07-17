import { TreeDataType } from '@lib/requests/getTreeData'
import { ViewportProps } from '@lib/types/map'
import {
  NEXT_PUBLIC_MAPTILER_BASEMAP_URL,
  NEXT_PUBLIC_MAPTILER_KEY,
} from '@lib/utils/envUtil'
import { mapRawQueryToState } from '@lib/utils/queryUtil'
import classNames from 'classnames'
import maplibregl, {
  AttributionControl,
  GeolocateControl,
  LngLatLike,
  Map,
  MapGeoJSONFeature,
  NavigationControl,
} from 'maplibre-gl'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { MapTilerLogo } from './MapTilerLogo'
import {
  TREES_ID_KEY,
  TREES_LAYER,
  TREES_LAYER_ID,
  TREES_SOURCE,
  TREES_SOURCE_ID,
} from './treesLayer'

interface OnSelectOutput {
  id: string
  latitude: number
  longitude: number
}

interface MapProps {
  staticViewportProps?: {
    maxZoom: number
    minZoom: number
  }
  initialViewportProps: {
    latitude: number
    longitude: number
    zoom: number
  }
  mapId: string
  mapStyle?: string
  latitude?: TreeDataType['lat']
  longitude?: TreeDataType['lng']
  treeIdToSelect?: string
  onSelect?: (treeData: OnSelectOutput) => void
  onOutdatedNowcastChange?: (isOutdated: boolean) => void
  isMinimized?: boolean
}

type URLViewportType = Pick<ViewportProps, 'latitude' | 'longitude' | 'zoom'>

const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

const transitionProps = {
  transitionDuration: 2000,
  transitionEasing: easeInOutQuad,
}

const checkForOutdatedNowcasts = (
  renderedFeatures: MapGeoJSONFeature[]
): boolean => {
  return (
    renderedFeatures?.some(
      (feature) =>
        new Date(feature.properties.nowcast_timestamp_stamm) <= new Date()
    ) || false
  )
}

export const TreesMap: FC<MapProps> = ({
  initialViewportProps,
  staticViewportProps,
  mapId,
  mapStyle = NEXT_PUBLIC_MAPTILER_BASEMAP_URL,
  latitude,
  longitude,
  treeIdToSelect,
  onSelect = () => undefined,
  onOutdatedNowcastChange = () => undefined,
  isMinimized = false,
}) => {
  const { replace, query, pathname } = useRouter()
  const mappedQuery = mapRawQueryToState(query)

  const map = useRef<Map | null>(null)

  const [viewport, setViewport] = useState<ViewportProps>({
    ...staticViewportProps,
    ...initialViewportProps,
  })

  const [currentSelectedTreeId, setCurrentSelectedTreeId] = useState<
    string | undefined
  >(treeIdToSelect)

  const [geolocateControl, setGeolocateControl] =
    useState<GeolocateControl | null>(null)
  const [navigationControl, setNavigationControl] =
    useState<NavigationControl | null>(null)
  const [attributionControl, setAttributionControl] =
    useState<AttributionControl | null>(null)

  // Update viewport when URL params provide new lat/lng/zoom values
  useEffect(() => {
    setViewport({
      ...viewport,
      ...transitionProps,
      latitude: mappedQuery.latitude || viewport.latitude,
      longitude: mappedQuery.longitude || viewport.longitude,
      zoom: mappedQuery.zoom || viewport.zoom,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappedQuery.latitude, mappedQuery.longitude, mappedQuery.zoom])

  // Change route after map interaction (zoom, pan, etc.) (debounced with 1s)
  const debouncedViewportChange = useDebouncedCallback(
    (viewport: URLViewportType): void => {
      if (pathname !== '/trees') return
      const newQuery = { ...mappedQuery, ...viewport }

      void replace({ pathname, query: newQuery }, undefined, { shallow: true })
    },
    1000
  )

  // Keep a reference to on click listener so that it can be turned off if necessary
  const onTreeClickCallback = useCallback(
    (e) => {
      // NOTE: We ignore TypeScript here for now because it is tricky to get the types right.
      // In theory they should match the type of the listener of map.current.on("click")

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!e.features) return

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const features = e.features as {
        properties: {
          [TREES_ID_KEY]?: string
          trees_lat?: number
          trees_lng?: number
        }
      }[]

      debouncedViewportChange.cancel()

      const properties = features[0].properties || {}
      const id = properties[TREES_ID_KEY]
      const latitude = properties.trees_lat
      const longitude = properties.trees_lng

      if (!id || !latitude || !longitude) return
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      onSelect({ id, latitude, longitude })
    },
    [debouncedViewportChange, onSelect]
  )

  // Attach or detach click listener when onSelect changes
  useEffect(() => {
    if (!map.current) return
    map.current.on('click', TREES_LAYER_ID, onTreeClickCallback)

    return () => {
      if (!map.current) return
      map.current.off('click', TREES_LAYER_ID, onTreeClickCallback)
    }
  }, [map, onTreeClickCallback])

  const MAP_STYLE_URL = `${mapStyle}?key=${NEXT_PUBLIC_MAPTILER_KEY}`

  // Setup a map instance with general event listeners etc.
  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapId || '',
      style: MAP_STYLE_URL,
      center: [viewport.longitude, viewport.latitude] as LngLatLike,
      zoom: viewport.zoom,
      attributionControl: false,
    })

    if (!map.current) return

    let hoveredTreeId: string | null = null

    map.current.on('load', function () {
      if (!map.current) return

      // This fires on every render (multiple times per second):
      map.current.on('render', afterChangeComplete)

      function afterChangeComplete(): void {
        // If the map is not fully loaded, we return early:
        if (!map.current?.loaded()) return

        // But if the map is loaded:
        // We check if there are outdated nowcasts and dispatch
        // the onOutdatedNowcastChange function:
        const renderedFeatures = map.current?.queryRenderedFeatures(undefined, {
          layers: [TREES_LAYER_ID],
        })

        const viewportHasOutdatedNowcasts =
          checkForOutdatedNowcasts(renderedFeatures)

        onOutdatedNowcastChange(viewportHasOutdatedNowcasts)

        // After the map has been fully loaded and the nowcast checked,
        // we can remove the handler:
        map.current.off('render', afterChangeComplete)
      }

      map.current.on('moveend', (e) => {
        // OUTDATED NOWCAST CHECK - start
        // We want to constantly check whether outdated nowcasts are visible
        // when the map is moved.
        const renderedFeatures = map.current?.queryRenderedFeatures(undefined, {
          layers: [TREES_LAYER_ID],
        })

        if (!renderedFeatures) return

        const viewportHasOutdatedNowcasts =
          checkForOutdatedNowcasts(renderedFeatures)

        onOutdatedNowcastChange(viewportHasOutdatedNowcasts)
        // OUTDATED NOWCAST CHECK - end

        debouncedViewportChange({
          latitude: e.target.transform._center.lat,
          longitude: e.target.transform._center.lng,
          zoom: e.target.transform._zoom,
        })
      })

      map.current.addSource(TREES_SOURCE_ID, TREES_SOURCE)
      map.current.addLayer(TREES_LAYER)

      // If we have a treeIdToSelect on the initial map load, we already set the selected feature state, so that the selected style is applied:
      if (treeIdToSelect) {
        map.current.setFeatureState(
          {
            source: TREES_SOURCE_ID,
            id: currentSelectedTreeId,
          },
          { selected: true }
        )
      }
    })

    map.current.on('click', TREES_LAYER_ID, onTreeClickCallback)

    map.current.on('mousemove', TREES_LAYER_ID, function (e) {
      if (!map.current || !e.features || e.features.length === 0) return
      if (hoveredTreeId) {
        map.current.setFeatureState(
          {
            source: TREES_SOURCE_ID,
            id: hoveredTreeId,
          },
          { hover: false }
        )
      }

      if (e.features[0].id) {
        hoveredTreeId = e.features[0].id as string

        map.current.setFeatureState(
          {
            source: TREES_SOURCE_ID,
            id: e.features[0].id,
          },
          { hover: true }
        )
      }
    })

    map.current.on('mouseleave', TREES_LAYER_ID, function () {
      if (!map.current) return

      if (hoveredTreeId) {
        map.current.setFeatureState(
          {
            source: TREES_SOURCE_ID,
            id: hoveredTreeId,
          },
          { hover: false }
        )
      }

      hoveredTreeId = null
    })

    setAttributionControl(new maplibregl.AttributionControl({ compact: true }))
    setNavigationControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      })
    )
    setGeolocateControl(new maplibregl.GeolocateControl({}))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Remove map controls when not on the /trees route (map view)
  useEffect(() => {
    if (
      !map.current ||
      !navigationControl ||
      !attributionControl ||
      !geolocateControl
    )
      return

    map.current.hasControl(navigationControl) &&
      map.current.removeControl(navigationControl)
    map.current.hasControl(attributionControl) &&
      map.current.removeControl(attributionControl)
    map.current.hasControl(geolocateControl) &&
      map.current.removeControl(geolocateControl)

    if (pathname !== '/trees') return

    map.current.addControl(navigationControl, 'bottom-right')
    map.current.addControl(attributionControl, 'bottom-left')
    map.current.addControl(geolocateControl, 'bottom-right')
  }, [map, pathname, geolocateControl, navigationControl, attributionControl])

  // Highlight and un-highlight selected trees
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return

    if (treeIdToSelect) {
      // Set feature state of treeIdToSelect to selected
      map.current.setFeatureState(
        {
          source: TREES_SOURCE_ID,
          id: treeIdToSelect,
        },
        { selected: true }
      )

      // If a valid treeIdToSelect is passed to the map, we set the state of currentSelectedTreeId to treeIdToSelect. So that later we can reference the ID. This will be useful when we want to remove the selected feature state (see next if statement)
      setCurrentSelectedTreeId(treeIdToSelect)
    }

    if (typeof treeIdToSelect === 'undefined' && currentSelectedTreeId) {
      // If we specify that there is no treeIdToSelect, we need to remove the selected feature state from source:
      map.current.setFeatureState(
        {
          source: TREES_SOURCE_ID,
          id: currentSelectedTreeId,
        },
        { selected: false }
      )

      // No more selected feature, so we set the state to undefined:
      setCurrentSelectedTreeId(undefined)
    }
  }, [map, currentSelectedTreeId, treeIdToSelect])

  // Fly to specific location when map is provided explicit lat/lng
  useEffect(() => {
    if (!map.current) return
    map.current.resize()
    if (!latitude || !longitude) return
    map.current.flyTo({
      center: [longitude, latitude],
      zoom: 18,
    })
  }, [map, latitude, longitude, isMinimized])

  return (
    <>
      <div
        id={mapId}
        className={classNames(
          isMinimized ? 'h-[154px]' : 'h-full',
          'w-full inline-block',
          'bg-[#FBFBFC]'
        )}
        aria-label="Kartenansicht der Bäume"
      />
      {!isMinimized && <MapTilerLogo />}
    </>
  )
}
