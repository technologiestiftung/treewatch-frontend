import { LayerSpecification, SourceSpecification } from 'maplibre-gl'
import colors from '../../style/colors'

export const TREES_LAYER_ID = 'outfull'

export const TREES_SOURCE: SourceSpecification = {
  type: 'vector',
  tiles: [process.env.NEXT_PUBLIC_TREE_TILES_URL as string],
  maxzoom: 14,
  minzoom: 0,
  promoteId: 'trees_gml_id',
}

const CIRCLE_STROKE_WIDTH = {
  default: 1,
  hovered: 5,
}

export const TREES_LAYER: LayerSpecification = {
  id: TREES_LAYER_ID,
  type: 'circle',
  source: TREES_LAYER_ID,
  'source-layer': TREES_LAYER_ID,
  maxzoom: 24,
  minzoom: 0,
  paint: {
    'circle-color': [
      'case',
      ['has', 'trees_pflanzjahr'],
      [
        'interpolate',
        ['linear'],
        /*
      Note that the following color scale is simply for demonstration purposes.
      In reality we will want to interpolate the color based on the Saugspannung value that will be available in the vector tile.
      At that point, the pflanzjahr has to be replaced with the new field's name and the domain changed from years to the values domain.
      */
        ['get', 'trees_pflanzjahr'],
        0, //0,
        colors.scale['1'],
        1960, //0.125,
        colors.scale['2'],
        1970, //0.25,
        colors.scale['3'],
        1980, //0.375,
        colors.scale['4'],
        1990, //0.5,
        colors.scale['5'],
        2000, //0.625,
        colors.scale['6'],
        2010, //0.75,
        colors.scale['7'],
        2020, //0.875,
        colors.scale['8'],
      ],
      colors.gray[200],
    ],
    'circle-stroke-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      CIRCLE_STROKE_WIDTH.hovered,
      CIRCLE_STROKE_WIDTH.default,
    ],
    'circle-stroke-color': [
      'case',
      ['has', 'trees_pflanzjahr'],
      [
        'interpolate',
        ['linear'],
        /*
      Note that the following color scale is simply for demonstration purposes.
      In reality we will want to interpolate the color based on the Saugspannung value that will be available in the vector tile.
      At that point, the pflanzjahr has to be replaced with the new field's name and the domain changed from years to the values domain.
      */
        ['get', 'trees_pflanzjahr'],
        0, //0,
        colors.scale['1-dark'],
        1960, //0.125,
        colors.scale['2-dark'],
        1970, //0.25,
        colors.scale['3-dark'],
        1980, //0.375,
        colors.scale['4-dark'],
        1990, //0.5,
        colors.scale['5-dark'],
        2000, //0.625,
        colors.scale['6-dark'],
        2010, //0.75,
        colors.scale['7-dark'],
        2020, //0.875,
        colors.scale['8-dark'],
      ],
      colors.gray[300],
    ],
    'circle-radius': [
      'interpolate',
      ['exponential', 0.5],
      ['zoom'],
      15,
      4,
      18,
      8,
      22,
      24,
    ],
  },
}
