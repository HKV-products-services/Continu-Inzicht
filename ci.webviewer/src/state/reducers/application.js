import { combineReducers } from 'redux'

import * as actions from '../actions'

function config(state={id:1}, action) {
  switch(action.type) {
    case actions.SET_APPLICATION_CONFIG:
      return action.config

    default:
      return state
  }
}

function error(state=null, action) {
  switch(action.type) {
    case actions.SET_ERROR:
      return action.error

    default:
      return state
  }
}

function warning(state=null, action) {
  switch(action.type) {
    case actions.SET_WARNING:
      return action.warning

    default:
      return state
  }
}

export default combineReducers({
  config,
  error,
  warning
})