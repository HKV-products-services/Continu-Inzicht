import { combineReducers } from 'redux'

import * as actions from '../actions'

const { SET_MEASURE_ID, SET_MEASURE_ALERT, SET_MEASURE_ANALYSE, SET_MEASURE_NAME, SET_MEASURE_PARAMETER } = actions

function id(state=0, action) {
  switch(action.type) {

    case SET_MEASURE_ID:
      return action.measure

    default:
      return state
  }
}

function alert(state=false, action) {
  switch(action.type) {

    case SET_MEASURE_ALERT:
      return action.measure

    default:
      return state
  }
}

function analyse(state='', action) {
  switch(action.type) {

    case SET_MEASURE_ANALYSE:
      return action.measure

    default:
      return state
  }
}

function name(state='geen maatregel', action) {
  switch(action.type) {

    case SET_MEASURE_NAME:
      return action.measure

    default:
      return state
  }
}

function parameter(state="1.0", action) {
  switch(action.type) {

    case SET_MEASURE_PARAMETER:
      return action.measure

    default:
      return state
  }
}

export default combineReducers({
  id,
  alert,
  analyse,
  name,
  parameter
})