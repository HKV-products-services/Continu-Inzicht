import { combineReducers } from 'redux'
import * as actions from '../actions'

function id(state=2, action) {
  switch(action.type) {
    case actions.SET_UNCERTAINTY_ID:
      return action.id

    default:
      return state
  }
}

function alert(state=false, action) {
  switch(action.type) {
    case actions.SET_UNCERTAINTY_ALERT:
      return action.open

    default:
      return state
  }
}

function code(state='AVG', action) {
  switch(action.type) {
    case actions.SET_ENSEMBLE_CODE:
      return action.code

    default:
      return state
  }
}

function name(state='Gemiddelde verwachtingen', action) {
  switch(action.type) {
    case actions.SET_UNCERTAINTY_NAME:
      return action.name

    default:
      return state
  }
}

export default combineReducers({
  id,
  alert,
  code,
  name
})