import { combineReducers } from 'redux'

import * as actions from '../actions'

function risico(state='RGETR', action) {
  switch(action.type) {
    case actions.SET_AREA_RISK:
      return action.risk

    default:
      return state
  }
}

export default combineReducers({
  risico
})