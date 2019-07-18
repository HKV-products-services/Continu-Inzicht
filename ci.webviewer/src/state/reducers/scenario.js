import { combineReducers } from 'redux'

import * as actions from '../actions'
const { SKIP_BUTTON_STATE } = actions

function disabled(state=false, action) {
  switch(action.type) {
    case SKIP_BUTTON_STATE:
      return action.disabled

    default:
      return state
  }
}

export default combineReducers({
  disabled
})