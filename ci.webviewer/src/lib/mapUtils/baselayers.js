import L from 'leaflet'

export function setBaselayers(map, layers) {
  
  layers.forEach(layer => {
    
    //let options = L.Util.extend(layer.options, defaultOptions);

    const baselayer = L.tileLayer(layer.url, layer.options)

    map.addLayerObject(layer.key, baselayer)
    
    if (layer.active) {
      baselayer.addTo(map)
    }
    
  })
}