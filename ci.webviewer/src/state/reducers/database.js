import { combineReducers } from 'redux'

import * as actions from '../actions'

function analyseParameters(state=[], action) {
  switch(action.type) {
    case actions.SET_ANALYSE_PARAMETERS:
      return action.parameters
    
    default:
      return state
  }
}

function appinfo(state={}, action) {
  switch(action.type) {
    case actions.SET_APP_INFO:
      return action.appinfo
    
    default:
      return state
  }
}

function area(state={}, action) {
  switch(action.type) {
    case actions.SET_AREA:
      return action.area

    default:
      return state
  }
}

function expertjudgement(state={}, action) {
  switch(action.type) {
    case actions.SET_EXPERTJUDGEMENT:
      return action.expertjudgement
    
    default:
      return state
  }
}

function conditions(state=null, action) {
  switch(action.type) {
    case actions.SET_CONDITIONS:
      return action.conditions

    default: state
      return state
  }
}

function loading(state=false, action) {
  switch(action.type) {
    case actions.LOADING_STATE:
      return action.loading

    default:
      return state
  }
}

function dialogLoading(state=false, action) {
  switch(action.type) {
    case actions.DIALOG_LOADING_STATE:
      return action.loading

    default:
      return state
  }
}

function logs(state=[], action) {
  switch(action.type) {
    case actions.SET_LOGS:
      return action.logs

    default:
      return state
  }
}

function logtype(state=2, action) {
  switch(action.type) {
    case actions.SET_REPORT_LOGTYPE:
      return action.logtype

    default:
      return state
  }
}

function measure(state={}, action) {
  switch(action.type) {
    case actions.SET_MEASURE:
      return action.measure

    default:
      return state
  }
}

function from(state=0, action) {
  switch(action.type) {
    case actions.SET_REPORT_FROM:
      return action.from

    case actions.SET_SCENARIO_FROM:
      return action.from

    default:
      return state
  }
}

function to(state=0, action) {
  switch(action.type) {
    case actions.SET_REPORT_TO:
      return action.to

    case actions.SET_SCENARIO_TO:
      return action.to

    default:
      return state
  }
}


function scenarioOptions(state=null, action) {
  switch(action.type) {
    case actions.SET_SCENARIO_OPTIONS:
      return action.options

    default:
      return state
  }
}

function section(state=null, action) {
  switch(action.type) {
    case actions.SET_SECTION:
      return action.section

    default:
      return state
  }
}

function simulation(state=null, action) {
  switch(action.type) {
    case actions.SET_SIMULATION:
      return action.simulation
    
    default:
      return state
  }
}

function station(state={}, action) {
  switch(action.type) {
    case actions.SET_STATION:
      return action.station
    
    default:
      return state
  }
}

function waterlevels(state=null, action) {
  switch(action.type) {
    case actions.SET_WATERLEVELS:
      return action.waterlevels

    default:
      return state
  }
}

function settings(state={}, action) {
  switch(action.type) {
    case actions.SET_KBA_SETTINGS:       
      return action.settings
    
    default:
      return state
  }
}

export default combineReducers({
  analyseParameters,
  appinfo,
  area,
  conditions,
  expertjudgement,
  from,
  loading,
  logs,
  logtype,
  measure,
  scenarioOptions,
  dialogLoading,
  section,
  simulation,
  station,
  to,
  waterlevels,
  settings
})