import { combineReducers } from 'redux'

import * as actions from '../actions'

const { ADD_WMS_LAYER, ADD_WMS_LAYERS, HIDE_LAYER, REMOVE_WMS_LAYER, SHOW_LAYER } = actions

function layers(state=[], action) {
  
  switch(action.type) {

    case ADD_WMS_LAYER:
      return [ ...state, action.layer ]

    case ADD_WMS_LAYERS:
      return [ ...state, ...action.layers ]

    case HIDE_LAYER:          
      return state.map(layer => {
        if(layer.key === action.layerKey) {
          layer.active = false
        }
        return layer
      })

    case REMOVE_WMS_LAYER:
      return state.filter(layer => layer.key !== action.layer.key)

    case SHOW_LAYER:
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