import { combineReducers } from 'redux'

import application from './application'

import area from './area'
import database from './database'
import dialogs from './dialogs'
import drawers from './drawers'
import grouplayers from './group-layers'
import measure from './measure'
import menu from './menu'
import moment from './moment'
import overlays from './overlays'
import scenario from './scenario'
import uncertainty from './uncertainty'
import views from './views'
import vega from './vega'
import waterlevel from './waterlevel'

export default combineReducers({
  application,
  area,
  database,
  dialogs,
  drawers,
  grouplayers,
  measure,
  menu,
  moment,
  overlays,
  scenario,
  uncertainty,
  vega,
  views,
  waterlevel
})