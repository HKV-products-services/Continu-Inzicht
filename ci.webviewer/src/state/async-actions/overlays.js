import * as actions from '../actions'
import * as geojson from './geo-json'
import * as wms from './wms'

export function addOverlay(map, layer, options, indexes, currentIndex) {
  return async function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    if (layer.type === 'geojson') {
      await dispatch(geojson.add(map, layer, options, indexes, currentIndex))
      await dispatch({ type: actions.LOADING_STATE, loading: false })
    } else if (layer.type === 'wms') {
      await dispatch(wms.add(map, layer))
      await dispatch({ type: actions.LOADING_STATE, loading: false })
    }
  }
}

export function addOverlayHandler(map, layerKey, { event, callback }) {
  return function (dispatch) {
    const layer = map.getLayerObject(layerKey)
    if (layer) {
      layer.on(event, callback)
    }
  }
}

export function removeOverlay(map, layer) {
  return async function (dispatch) {
    const mapLayer = map.getLayerObject(layer.key)
    if (mapLayer) {
      map.removeLayer(mapLayer)

      map.deleteLayerObject(layer)
      const action = layer.type === 'geojson'
        ? 'REMOVE_GEOJSON_LAYER'
        : 'REMOVE_WMS_LAYER'

      dispatch({ type: action, layer })
    }
  }
}

export function removeOverlayHandler(map, layerKey, { event, callback }) {
  return function (dispatch) {
    const layer = map.getLayerObject(layerKey)

    if (layer) {
      layer.off(event, callback)
    }
  }
}

export function showLayer(map, layerKey) {
  return function (dispatch) {
    const layer = map.getLayerObject(layerKey)
    if (layer) {
      const activeZIndex = layer.options.defaultZIndex + 100
      const panes = map.getPanes()
      panes[layer.options.pane].style.zIndex = activeZIndex
      map.addLayer(layer)
      dispatch({ type: actions.SHOW_LAYER, layerKey })
      dispatch({ type: actions.SHOW_GROUP_LAYER, groupId: layerKey })
      if (layerKey === 'meetstations') {
        dispatch({ type: actions.WATERLEVEL_BUTTON_STATE, open: true })
      }
    }
  }
}

export function hideLayer(map, layerKey) {
  return function (dispatch) {
    const layer = map.getLayerObject(layerKey)
    if (layer) {
      const panes = map.getPanes()
      panes[layer.options.pane].style.zIndex = layer.options.defaultZIndex
      map.removeLayer(layer)
      dispatch({ type: actions.HIDE_LAYER, layerKey })
      dispatch({ type: actions.HIDE_GROUP_LAYER, groupId: layerKey })
      if (layerKey === 'meetstations') {
        dispatch({ type: actions.WATERLEVEL_BUTTON_STATE, open: false })
        dispatch({ type: actions.WATERLEVEL_REMOTES_STATE, open: false })
      }
    }
  }
}

export function zoomToOverlay(map, layerKey) {
  return function (dispatch) {
    const layer = map.getLayerObject(layerKey)
    map.fitBounds(layer.getBounds())
  }
}

export function zoomToMarker(map, lngslat, zoom) {
  const featureGroup = L.featureGroup([
    L.marker([lngslat[1], lngslat[0]])
  ])
  const latlngs = [lngslat[1], lngslat[0]]
  return function (dispatch) {
    const currentZoom = map.getZoom()
    if (currentZoom >= zoom) {
      map.flyTo(latlngs, currentZoom)
    } else {
      map.flyTo(latlngs, zoom)
    }
  }
}