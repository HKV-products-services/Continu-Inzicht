import L from 'leaflet'

import * as svgicon from '../mapUtils/svg-icon'

function createTooltip(tooltip, properties) {
  let html = "<div><table>"
  tooltip.fields.forEach(field => {
    html += "<tr><td class='key'>" + (field.title || field.field) + ":</td>"
    html += "<td class='value'>" + properties[field.field] + "</td></tr>"
  })
  html += "</table></div>"
  return html
}

function createStyle(feature, layer, styles) {
  const myStyle = {}
  styles.forEach(style => {
    let value = feature.properties[style.property]
    if ((style.style == "fillColor" || style.style == "color") && value == null) {
      value = "#BDBDBD"
    }
    myStyle[style.style] = value
  })
  return myStyle
}

function createConditionStyle(feature, layer, styles, options, indexes, currentIndex) {
  const myStyle = {}
  indexes && indexes.length > 1 && indexes.map(index => {
    let colorFieldName = `color${index}`
    let currentColorFieldName = `color${currentIndex}`
    styles.forEach(style => {
      let value = feature.properties[`${style.property}${index}`]
      if ((style.style == "fillColor" || style.style == "color") && value == null) {
        feature.properties[colorFieldName] = "#BDBDBD"
      } else {
        let isSet = false
        options.map(option => {
          if (option.value > value && !isSet) {
            feature.properties[colorFieldName] = option.color
            isSet = true
          }
        })
      }
      myStyle[style.style] = feature.properties[currentColorFieldName]
    })
  })
  return myStyle
}

function onEachFeature(feature, layer, tooltip, onClick, onMouseOver, onMouseOut, options, indexes, currentIndex) {
  var popup = L.popup({
    'autoPan': false,
    'closeButton': false
  })
    .setContent(
      createTooltip(tooltip, feature.properties)
    )
  if (tooltip) {
    if (tooltip.show) {
      // layer.bindPopup(createTooltip(tooltip, feature.properties))
      layer.bindPopup(popup)
      layer.on('mouseover', function (e) {
        this.openPopup()
      })
      layer.on('mouseout', function (e) {
        this.closePopup()
      })
    }
  }
  if (onMouseOver) {
    layer.on('mouseover', onMouseOver)
  }
  if (onMouseOut) {
    layer.on('mouseout', onMouseOut)
  }
  if (onClick) {
    layer.on('click', onClick)
  }
  if (layer.options.style) {
    if (layer.options.style.type === 'property') {
      const myStyle = createStyle(feature, layer, layer.options.style.property_style)
      layer.setStyle(myStyle)
    } else if (layer.options.style.type === 'moment') {
      const myStyle = createStyle(feature, layer, layer.options.style.moment_style)
      layer.setStyle(myStyle)
    } else if (layer.options.style.type === 'condition') {
      const myStyle = createConditionStyle(feature, layer, layer.options.style.condition_style, options, indexes, currentIndex)
      layer.setStyle(myStyle)
    } else {
      layer.setStyle(layer.options.style)
    }
  }
}

function pointToLayer(style, latlng) {
  switch (style.type) {
    case 'circle':
      return L.circleMarker(latlng)

    case 'icon':
      var marker = L.marker.svgMarker(latlng)
      marker.options.iconFactory = L.divIcon.svgIcon

      // create icon
      const iconOptions = {
        iconPath: style.iconPath,
        iconSize: style.iconSize,
        color: style.color,
        opacity: style.opacity
      }

      marker.setIcon(marker.options.iconFactory(iconOptions))

      return marker

    default:
      return L.marker(latlng)
  }
}

export function getPaneIndex(paneType) {
  switch (paneType) {
    case 'marker': {
      return 600
    }
    case 'overlay': {
      return 400
    }
    case 'tile':
    default: {
      return 200
    }
  }
}

export function addGeojson(map, layer, optionObject, indexes, currentIndex) {
  const tooltip = layer.tooltip
  const onClick = layer.onClick
  const onMouseOver = layer.onMouseOver
  const onMouseOut = layer.onMouseOut

  const layerGroup = L.layerGroup()

  layerGroup.key = layer.key
  layerGroup.name = layer.name
  layerGroup.view = layer.view
  layerGroup.active = layer.active
  layerGroup.selection = layer.selection
  layerGroup.zIndex = layer.zIndex
  layerGroup.disabled = layer.disabled

  const pane = map.createPane(layer.key)
  if (layer.zIndex) {
    pane.style.zIndex = layer.zIndex
  } else {
    layer.defaultZIndex = getPaneIndex(layer.paneType)
  }

  if (layer && layer.data && layer.data.features) {

    const options = {
      pane: layer.key,
      style: layer.style,
      pointToLayer: layer.pointToLayer ? layer.pointToLayer : (_, latlng) => pointToLayer(layer.style, latlng),
      onEachFeature: layer.onEachFeature ? layer.onEachFeature : (feature, layer) => onEachFeature(feature, layer, tooltip, onClick, onMouseOver, onMouseOut, optionObject, indexes, currentIndex),
      defaultZIndex: layer.defaultZIndex
    }

    const mapLayer = L.geoJSON(layer.data, options)

    layerGroup.setZIndex(layer.zIndex)
    layerGroup.addLayer(mapLayer)
    map.addLayerObject(layer.key, mapLayer)
    if (layer.active) {
      layerGroup.addTo(map)
      if (layer.zoomto) {
        map.fitBounds(mapLayer.getBounds())
      }
    }
  }


  return layerGroup
}

export function addWms(map, layer) {

  const layerGroup = L.layerGroup()
  layerGroup.key = layer.key
  layerGroup.name = layer.name
  layerGroup.view = layer.view
  layerGroup.active = layer.active
  layerGroup.selection = layer.selection
  layerGroup.groupkey = layer.groupkey

  const pane = map.createPane(layer.key);
  if (layer.zIndex) {
    pane.style.zIndex = layer.zIndex
  }

  let layers = layer.layer

  if (layer.workspace) {
    if (layer.workspace.length > 0) {
      layers = `${layer.workspace}:${layer.layer}`
    }
  }

  const mapLayer = L.tileLayer.wms(layer.url, {
    pane: layer.key,
    layers: layers,
    styles: layer.styles,
    format: 'image/png',
    transparent: true,
    opacity: layer.opacity,
    zIndex: layer.zIndex,
    disabled: layer.disabled
  })

  if (layer.wmsparams) {
    Object.keys(layer.wmsparams).map(key => {
      mapLayer.wmsParams[key] = layer.wmsparams[key]
    })
  }

  layerGroup.setZIndex(layer.zIndex)
  layerGroup.addLayer(mapLayer)
  map.addLayerObject(layer.key, mapLayer)

  if (layer.active) {
    layerGroup.addTo(map)
  }

  return layerGroup
}

export default function (map, layer, options, indexes, currentIndex) {
  if (map.hasLayerObject(layer)) { return }
  switch (layer.type) {
    case 'geojson':
      return addGeojson(map, layer, options, indexes, currentIndex)
    case 'wms':
      return addWms(map, layer)
    default:
      return undefined
  }
}