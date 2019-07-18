import { combineReducers } from 'redux'

import * as actions from '../actions'

function layers(state=[], action) {
  switch(action.type) {
    case actions.ADD_GEOJSON_LAYER:
      return [ ...state, action.layer ]

    case actions.HIDE_LAYER:
      return state.map(layer => {
        if(layer.key === action.layerKey) {
          layer.active = false
        }
        return layer
      })

    case actions.REMOVE_GEOJSON_LAYER:
      return state.filter(layer => layer.key !== action.layer.key)

    case actions.SHOW_LAYER:
      return state.map(layer => {
        if(layer.key === action.layerKey) {
          layer.active = true
        }
        
        return layer
      })

    default:
      return state
  }
}

export default combineReducers({
  layers
})