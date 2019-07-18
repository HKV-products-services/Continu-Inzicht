import { combineReducers } from 'redux'

import * as actions from '../actions'

function open(state=false, action) {
  switch(action.type) {
    case actions.WATERLEVEL_BUTTON_STATE:
      return action.open

    default:
      return state
  }
}

function remote(state=false, action) {
  switch(action.type) {
    case actions.WATERLEVEL_REMOTES_STATE:
      return action.open

    default:
      return state
  }
}

export default combineReducers({
  open,
  remote
})