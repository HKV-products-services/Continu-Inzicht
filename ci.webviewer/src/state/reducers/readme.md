# Reducers

This directory contains the `redux` reducers. For more information on the details look at the [Redux documentation](https://redux.js.org/).

## Overlays

All layers that are added to the map are treated the same. To make this work we split
the functionality into different submodules. By default we provide the `geojson` and `wms`
submodules.
To add new layer types create a new submodule and update the `overlays` module to use this new type.

### GeoJson

Info about geojson

### WMS

Info about WMS