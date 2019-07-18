import * as actions from '../actions'
import { addLayer } from '../../lib/mapUtils'

export function add(map, layer) {
  return function(dispatch) {
    if(map.hasLayerObject(layer)) return

    addLayer(map, layer)
    dispatch({ type: actions.ADD_WMS_LAYER, layer })

    const grouplayer = { key: layer.key, disabled: layer.disabled, name: layer.name, view: layer.view, active: layer.active, selection: layer.selection, groupkey : layer.groupkey }
    dispatch({ type: actions.ADD_GROUP_LAYER, grouplayer})

    return layer
  }
}

export function remove() {
  return function(dispatch) {
    console.warn('Remove the WMS layer')
  }
}