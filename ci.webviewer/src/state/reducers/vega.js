import { combineReducers } from 'redux'
import * as actions from '../actions'

function specs(state=null, action) {  
  switch (action.type) {
    case actions.SET_VEGA_SPECIFICATION:
      return action.specification 

    default:
      return state;
  }
}

export default combineReducers({
  specs
})