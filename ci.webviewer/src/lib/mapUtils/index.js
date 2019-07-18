let addMapIcons
let addLayer
let createMap
let setBaselayers
let addRainsat

if(typeof window !== 'undefined') {
  addMapIcons = require('./addMapIcons').addMapIcons
  addLayer = require('./overlays').default
  createMap = require('./createMap').createMap
  setBaselayers = require('./baselayers').setBaselayers
  addRainsat = require('./addRainsat').addRainsat
}

export {
  addMapIcons,
  addLayer,
  createMap,
  addRainsat,
  setBaselayers
}

