import { combineReducers } from 'redux'

import * as actions from '../actions'

import geoJson from './geojson'
import wms from './wms'

function id(state=null, action) {
  switch(action.type) {
    case actions.SET_FEATURE_ID:
      return action.id
    
    default:
      return state
  }
}

function name(state=null, action) {
  switch(action.type) {
    case actions.SET_FEATURE_NAME:
      return action.name
    
    default:
      return state
  }
}

function selected(state=null, action) {
  switch(action.type) {
    case actions.SET_SELECTED_FEATURE:
      return action.selected
    
    default:
      return state
  }
}

export default combineReducers({
  id,
  name,
  geoJson,
  selected,
  wms
})