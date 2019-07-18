import L from 'leaflet'

import './leaflet/leaflet.timedimension.control.css'

import './leaflet/iso8601.min'
import './leaflet/NonTiledLayer-src'
import './leaflet/leaflet.timedimension.src'
import './leaflet/leaflet.timedimension.tilelayer.rainsat'

export function addRainsat(map, first, layer, dataset) {

  if (map){


    // only RAINSAT_ files
    const datasets = dataset.filter(dataset => dataset._attributes.name.indexOf('RAINSAT_') !== -1)
    if (datasets.length > 0) {

      // Get latest timeframe
      const timestr = datasets[0]._attributes.name.substr(8, 15);

      let startdate = new Date(timestr.substr(0, 4), timestr.substr(4, 2) - 1, timestr.substr(6, 2),
        timestr.substr(9, 2), timestr.substr(11, 2), timestr.substr(13, 2))

      // periode van (hour) uur stappen van 15 min
      const timeDimension = new L.TimeDimension({
        timeInterval: "PT" + layer.options.pasthours + "H/" + startdate.toISOString(),
        period: layer.options.period,
        currentTime: startdate
      });

      // helper to share the timeDimension object between all layers
      map.timeDimension = timeDimension;

      const layerGroup = L.layerGroup()
      layerGroup.key = layer.key
      layerGroup.name = layer.name
      layerGroup.view = layer.view
      layerGroup.active = layer.active
      layerGroup.selection = layer.selection
      layerGroup.setZIndex(layer.zIndex)
      
      if (first){

        const pane = map.createPane(layerGroup.key)
        if (layer.zIndex){
          pane.style.zIndex = layer.zIndex
        }
        const timeDimensionControl = new L.Control.TimeDimension({
          displayDate: true,
          timeSlider: layer.options.timeslider,
          displayDate: layer.options.displaydate,
          timeDimension: timeDimension,
          speedSlider: layer.options.speedslider,
          position: layer.options.position,
          autoPlay: layer.options.autoplay,
          forwardButton: layer.options.forwardbutton,
          backwardButton: layer.options.backwardbutton,
          playerOptions: {
            loop: layer.options.loop,
            transitionTime: layer.options.transitiontime,
          }
        });

        map.addControl(timeDimensionControl);    

        const rainsatUrl = layer.url + 'wms/rainsat/RAINSAT_{d}.nc?'

        var rainsatLayer = L.nonTiledLayer.wms(rainsatUrl, {
          pane: layer.key,
          layers: layer.layer,
          format: 'image/png',
          transparent: true,
          opacity : layer.opacity,
          tileSize: 512,
          styles: "boxfill/rainbow",
          colorscalerange: '0.1,100',
          numcolorbands: '9',
          belowmincolor: 'transparent',
          abovemaxcolor: '0x000000',
          logscale: false,
          attribution: '&copy; <a href="https://www.hkv.nl/en">HKV services</a>'
        });

        var rainsatTimeLayer = L.timeDimension.layer.tileLayer.rainsat(rainsatLayer, {});

        layerGroup.addLayer(rainsatTimeLayer)
        map.addLayerObject(layer.key, rainsatTimeLayer)
        if (layer.active) {
          layerGroup.addTo(map)
          if (layer.zoomto) {
            map.fitBounds(rainsatTimeLayer.getBounds())
          }
        }
        
      }
      return layerGroup
    }
  }

}