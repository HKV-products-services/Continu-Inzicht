import * as actions from '../actions'

import { addLayer } from '../../lib/mapUtils'
import { fetchGeoJson } from '../../lib'

export function add(map, layer, options, indexes, currentIndex) {
  return async function (dispatch) {
    if (!layer.data){
      const geojson = await fetchGeoJson(layer.url)
      layer.data = geojson
    }
    if (map.hasLayerObject(layer)) return

    const grouplayer = addLayer(map, layer, options, indexes, currentIndex)

    dispatch({ type: actions.ADD_GEOJSON_LAYER, layer })
    dispatch({ type: actions.ADD_GROUP_LAYER, grouplayer })
    return grouplayer
  }
}

export function remove(map, layer) {
  return function (dispatch) {
    console.log('Remove a geojson layer')
  }
}

export function setStyle(map, layerKey, style) {
  return function (dispatch) {
    const layerObject = map.getLayerObject(layerKey)
    if (layerObject) {
      layerObject.setStyle(style)
    }
  }
}