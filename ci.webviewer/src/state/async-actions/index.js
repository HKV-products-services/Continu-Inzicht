import * as application from './application'
import * as database from './database/index'
import * as geojson from './geo-json'
import * as overlays from './overlays'
import * as signal from './signal-handler'
import * as groupLayers from './group-layers'
import * as wms from './wms'
import * as vega from './vega'

export default {
  ...application,
  ...database.default,
  ...overlays,
  geojson,
  wms,
  ...signal,
  ...vega,
  ...groupLayers
}
