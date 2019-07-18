import { combineReducers } from 'redux'
import * as actions from '../actions'

function state(state=false, action) {
  switch(action.type) {
    case actions.HKV_DIALOG_STATE:
      return action.open

    default:
      return state
  }
}

function type(state=null, action) {
  switch(action.type) {
    case actions.HKV_DIALOG_TYPE:
      return action.value

    default:
      return state
  }
}

function measureVal(state=false, action) {
  switch(action.type) {
    case actions.MEASURES_VAL_DIALOG_STATE:
      return action.open
      
    default:
      return state
  }
}

function scenario(state=false, action) {
  switch(action.type) {
    case actions.SCENARIO_DIALOG_STATE:
      return action.open

    default:
      return state
  }
}

function section(state=false, action) {
  switch(action.type) {
    case actions.SECTION_DIALOG_STATE:
      return action.open
      
    default:
      return state
  }
}

function start(state=true, action) {
  switch(action.type) {
    case actions.START_DIALOG_STATE:
      return action.open
      
    default:
      return state
  }
}

export default combineReducers({
  state,
  type,
  measureVal,
  scenario,
  section,
  start
})