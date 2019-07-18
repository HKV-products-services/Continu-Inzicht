import { combineReducers } from 'redux'

import * as actions from '../actions'
const { DRAWER_BOTTOM_STATE, DRAWER_LEFT_STATE, DRAWER_RIGHT_STATE, DRAWER_SCENARIO_STATE } = actions

function bottom(state=false, action) {
  switch(action.type) {

    case DRAWER_BOTTOM_STATE:
      return action.open

    default:
      return state
  }
}

function right(state=false, action) {
  switch(action.type) {

    case DRAWER_RIGHT_STATE:
      return action.open

    default:
      return state
  }
}

function left(state=false, action) {
  switch(action.type) {

    case DRAWER_LEFT_STATE:
      return action.open

    default:
      return state
  }
}

function scenario(state=false, action) {
  switch(action.type) {
    case DRAWER_SCENARIO_STATE:
      return action.open

    default:
      return state
  }
}

export default combineReducers({
  bottom,
  right,
  left,
  scenario
})