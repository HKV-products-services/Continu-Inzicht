import { combineReducers } from "redux";

import * as actions from '../actions'

const { ADD_GROUP_LAYER, HIDE_GROUP_LAYER, REMOVE_GROUP_LAYER, SHOW_GROUP_LAYER } = actions;

function items(state = [], action) {

  switch (action.type) {

    case ADD_GROUP_LAYER:
      const findLayer = state.filter(layer => layer.key === action.grouplayer.key);
      
      if (findLayer.length > 0) {
        return state
      }
      else {
        return [...state, action.grouplayer]
      }

    case HIDE_GROUP_LAYER:
      return state.map(grouplayer => {
        if (grouplayer.key === action.groupId) {
          grouplayer.active = false
        }
        return grouplayer
      })

    case REMOVE_GROUP_LAYER:
      return state.filter(layer => layer.key !== action.layer.key)

    case SHOW_GROUP_LAYER:
      return state.map(grouplayer => {
        if (grouplayer.key === action.groupId) {
          grouplayer.active = true
        }
        return grouplayer
      })

    default:
      return state;
  }
}

export default combineReducers({
  items
});
