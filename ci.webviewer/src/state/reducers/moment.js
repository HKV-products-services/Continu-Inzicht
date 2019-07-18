import { combineReducers } from 'redux'

import * as actions from '../actions'

const { SET_INITIAL_MOMENT_DATE, SET_MOMENT_DATE, SET_MOMENT_INDEX } = actions

function date(state=null, action) {
  switch(action.type) {
    case SET_MOMENT_DATE:
      return action.date

    default:
      return state
  }
}

function index(state=1, action) {
  switch(action.type) {
    case SET_MOMENT_INDEX:
      return action.index

    default:
      return state
  }
}

function initDate(state=null, action) {
  switch(action.type) {
    case SET_INITIAL_MOMENT_DATE:
      return action.date

    default:
      return state
  }
}

export default combineReducers({
  date,
  index,
  initDate
})