import { WATER_SUPPLY_STATUSES } from '@lib/utils/mapSuctionTensionToStatus'
import { LayerSpecification, SourceSpecification } from 'maplibre-gl'
import colors from '../../style/colors'

/** ID with which we can reference trees layer */
export const TREES_LAYER_ID = 'trees'
export const TREES_ID_KEY = 'trees_id'

/** ID with which we can reference the layer for outdated nowcast values
 */
export const OUTDATED_NOWCAST_INDICATORS_LAYER_ID =
  'outdated_nowcast_indicators'

/** Name of the source in the vector tileset */
export const TREES_SOURCE_ID = 'treesgeo'

/** Name of the source layer in the vector tileset */
export const TREES_SOURCE_LAYER_ID = 'treesgeo'

const NOWCAST_AVERAGE_PROPERTY = 'nowcast_values_stamm'

// 2024-07-11: This project is about to be archived.
// For archiving purposes, we render a selection of static trees on the map and make the the frontend independent of backend, database and vector tiles.
export const TREES_SOURCE: SourceSpecification = {
  type: 'geojson',
  data: '/trees.geojson',
  promoteId: TREES_ID_KEY,
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 5,
}

const CIRCLE_STROKE_WIDTH = {
  default: 1,
  highlighted: 5,
}

/**
 * Constructs a flat array where color values and numbers alternate. Finishes with a color value for every value above the last number. This array is used as the stepper for the layer color scales.
 * @param idSuffix string
 * @returns (string | number)[]
 */
const getColorScale = (idSuffix = ''): (string | number)[] => {
  return WATER_SUPPLY_STATUSES.flatMap<string | number>((statusItem) => {
    return [
      colors.scale[`${statusItem.id}${idSuffix}` as keyof typeof colors.scale],
      statusItem.suctionTensionRange[1],
    ]
  }).slice(0, -1) // Removes the last number value because it not needed anymore
}

export const TREES_LAYER: LayerSpecification = {
  id: TREES_LAYER_ID,
  type: 'circle',
  source: TREES_SOURCE_ID,
  maxzoom: 24,
  minzoom: 0,
  layout: {
    'circle-sort-key': ['get', NOWCAST_AVERAGE_PROPERTY],
  },
  paint: {
    'circle-color': [
      'case',
      [
        'all',
        ['has', NOWCAST_AVERAGE_PROPERTY],
        ['!=', ['get', NOWCAST_AVERAGE_PROPERTY], null],
      ],
      ['step', ['get', NOWCAST_AVERAGE_PROPERTY], ...getColorScale()],
      'rgba(0, 0, 0, 0)',
    ],
    'circle-stroke-width': [
      'case',
      [
        'boolean',
        ['feature-state', 'selected'],
        ['feature-state', 'hover'],
        false,
      ],
      CIRCLE_STROKE_WIDTH.highlighted,
      CIRCLE_STROKE_WIDTH.default,
    ],
    'circle-stroke-color': [
      'case',
      ['has', NOWCAST_AVERAGE_PROPERTY],
      ['step', ['get', NOWCAST_AVERAGE_PROPERTY], ...getColorScale('-dark')],
      colors.gray[400],
    ],
    'circle-opacity': 1,
    'circle-stroke-opacity': 1,
    'circle-radius': [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      15,
      4,
      18,
      14,
      19,
      16,
      20,
      28,
      21,
      32,
      22,
      40,
    ],
  },
}
