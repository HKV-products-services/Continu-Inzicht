import { combineReducers } from 'redux'

import * as actions from '../actions'
const { SET_MENU_INDEX, SET_MENU_LABEL } = actions

function index(state=0, action) {
  switch(action.type) {
    case SET_MENU_INDEX:
      return action.index

    default:
      return state
  }
}

function label(state=null, action) {
  switch(action.type) {
    case SET_MENU_LABEL:
      return action.label

    default:
      return state
  }
}

export default combineReducers({
  index,
  label
})