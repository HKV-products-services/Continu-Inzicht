import L from 'leaflet'

import './leaflet/leaflet.polylineoffset'

import { setBaselayers } from './baselayers'
import { withLayerHelpers } from './extensions/with-layer-helpers'

export function createMap(element, config, loadCallback, myOptions, myKey) {

  const map = L.map(element, {
    minZoom: config.map.settings.minzoom,
    maxZoom: config.map.settings.maxzoom,
    zoomControl: false,
    attributionControl: false,
    scaleControl: false,
    timeDimensionControl: false,
    preferCanvas: true
  })

  withLayerHelpers(map)

  map._layerKeys = []
  
  map.on('load', (event) => {

    setBaselayers(map, config.map.baselayers)

    // Attribution control
    if (config.map.settings.controls.attribution.show) {
      L.control.attribution({
        position: config.map.settings.controls.attribution.position
      }).addTo(map)
    }

    // Zoom control
    if (config.map.settings.controls.zoom.show) {
      L.control.zoom({
        position: config.map.settings.controls.zoom.position
      }).addTo(map)
    }

    //Scale control
    if (config.map.settings.controls.scale.show) {
      L.control.scale({
        imperial: config.map.settings.controls.scale.show.options
      }).addTo(map)
    }

    map.myOptions = myOptions
    map.myKey = myKey

    if (config.map.settings.controls.hasOwnProperty('timedimension')) {

      if (config.map.settings.controls.timedimension.show) {

        const timeDimension = new L.TimeDimension();
  
        // helper to share the timeDimension object between all layers
        map.timeDimension = timeDimension;

        const timedimension = config.map.settings.controls.timedimension

        L.control.timeDimension({
          displayDate: true,
          timeSlider: timedimension.options.timeslider,
          displayDate: timedimension.options.displaydate,
          speedSlider: timedimension.options.speedslider,
          position: timedimension.options.position,
          timeDimension: timeDimension,
          autoPlay: timedimension.options.autoplay,
          forwardButton: timedimension.options.forwardbutton,
          backwardButton: timedimension.options.backwardbutton,
          playerOptions: {
            loop: timedimension.options.loop,
            transitionTime: timedimension.options.transitiontime,
          }
        }).addTo(map)
      }
    }
    loadCallback(event.target, myOptions, myKey)
  })

  map.setView(config.map.settings.center, config.map.settings.zoom)

  return map
}