import { combineReducers } from 'redux'

import * as actions from '../actions'
const { SET_ACTIVE_VIEW } = actions

function active(state=null, action) {
  switch(action.type) {

    case SET_ACTIVE_VIEW:
      return action.active

    default:
      return state
  }
}

export default combineReducers({
  active
})