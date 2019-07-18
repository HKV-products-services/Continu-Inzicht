import * as actions from '../../actions'
import { getUrl } from '../database/mangrove'

export function skipSimulationStep(server, appid) {

  const parameters = {
    appid: appid
  }

  const functionName = `mangrove.appfunctions.TaskRunner`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    await fetch(url)
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getAreaById(server, appid, areaid, momentid) {

  const parameters = {
    appid: appid,
    id: areaid,
    momentid: momentid
  }

  const functionName = `ci.appfunctions.GetAreaById`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setAreaInState(json)))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getAreaByList(server, appid, areaids) {

  const parameters = {
    appid: appid,
    id: [areaids]
  }

  const functionName = `ci.appfunctions.GetAreaByList`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSectionInState(json)))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getConditions(server, appid, objecttype) {

  const parameters = {
    appid: appid,
    objecttype: objecttype
  }

  const functionName = `ci.appfunctions.GetConditions`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setConditionsInState(json)))
      .then(dispatch({ type: actions.LOADING_STATE, loading: false }))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getLog(server, appid, logtype, from, to) {

  const parameters = {
    appid: appid,
    logtype: logtype,
    from: from,
    to: to
  }

  const functionName = `ci.appfunctions.GetLog`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setLogInState(json)))
      .then(json => { dispatch({ type: actions.LOADING_STATE, loading: false }); return json })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getScenarioOptions(server, appid, options) {

  var parameters = {
    appid: appid
  }

  for (var i in options) {
    parameters[i] = options[i]
  }

  const functionName = `ci.appfunctions.GetScenarioOptions`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setScenarioOptionsInState(json)))
      .then(data => {
        dispatch({ type: actions.LOADING_STATE, loading: false })
        return data
      })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getSectionById(server, appid, sectionid, momentid, ensembleid) {

  const parameters = {
    appid: appid,
    id: sectionid,
    momentid: momentid,
    ensembleid: ensembleid
  }

  const functionName = `ci.appfunctions.GetSectionById`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSectionInState(json)))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getSectionByList(server, appid, sectionids, ensembleid, failuremechanismid) {

  const parameters = {
    appid: appid,
    ensembleid: ensembleid,
    id: sectionids,
    failuremechanismid: failuremechanismid
  }

  const functionName = `ci.appfunctions.GetSectionByList`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    dispatch({ type: actions.DIALOG_LOADING_STATE, loading: true })
    await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSectionInState(json)))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
    await dispatch({ type: actions.DIALOG_LOADING_STATE, loading: false })
  }
}

export function getStationById(server, appid, stationid, ensembleid) {

  const parameters = {
    appid: appid,
    id: stationid,
    ensembleid: ensembleid
  }

  const functionName = `ci.appfunctions.GetStationById`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setStationInState(json)))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function setAreaExpertjudgement(server, appid, areaid, expertjudgement) {

  const parameters = {
    appid: appid,
    areaid: areaid,
    expertjudgement: expertjudgement
  }

  const functionName = `ci.appfunctions.SetAreaExpertjudgement`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setExpertjudgementInState(json)))
      .then(dispatch({ type: actions.HKV_DIALOG_STATE, open: false }))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function setSectionMeasure(server, appid, sectionid, measureid, successrate) {

  const parameters = {
    appid: appid,
    sectionid: sectionid,
    measureid: measureid,
    successrate: successrate
  }

  const functionName = `ci.appfunctions.SetSectionMeasure`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setMeasureInstate(json)))
      .then(dispatch({ type: actions.HKV_DIALOG_STATE, open: false }))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function setSectionExpertjudgement(server, appid, sectionid, expertjudgement, rate) {

  const parameters = {
    appid: appid,
    sectionid: sectionid,
    expertjudgement: expertjudgement,
    expertjudgementrate: rate
  }

  const functionName = `ci.appfunctions.SetSectionExpertjudgement`
  const url = getUrl(server, functionName, parameters)

  return function (dispatch) {
    fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setExpertjudgementInState(json)))
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getSettings(server, appid) {

  const parameters = {
    appid: appid
  }

  const functionName = `ci.appfunctions.getSettings`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    return await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSettingsInState(json)))
      .then(json => { return json })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getSimulation(server, appid) {

  const parameters = {
    appid: appid
  }

  const functionName = `ci.appfunctions.GetSimulation`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    return await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSimulationInState(json)))
      .then(data => {
        return data
      })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function setSimulation(server, appid, options, starttime, endtime, timestep) {

  var parameters = {
    appid: appid,
    starttime: starttime,
    endtime: endtime,
    timestep: timestep
  }

  for (var i in options) {
    parameters[i] = options[i]
  }

  const functionName = `ci.appfunctions.SetSimulation`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    dispatch({ type: actions.SCENARIO_DIALOG_STATE, open: false })
    return await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSimulationInState(json)))
      .then(data => {
        dispatch({ type: actions.LOADING_STATE, loading: false })
        return data
      })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function setSimulationActive(server, appid, state) {

  const parameters = {
    appid: appid,
    active: state
  }

  const functionName = `ci.appfunctions.SetSimulationActive`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setSimulationInState(json)))
      .then(data => {
        dispatch({ type: actions.LOADING_STATE, loading: false })
        return data
      })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function getWaterlevels(server, appid, stationid, options) {

  var parameters = {
    appid: appid,
    stationid: stationid
  }

  for (var i in options) {
    parameters[i] = options[i]
  }

  const functionName = `ci.appfunctions.SetSimulation`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    dispatch({ type: actions.LOADING_STATE, loading: true })
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setWaterlevelsInState(json)))
      .then(data => {
        dispatch({ type: actions.LOADING_STATE, loading: false })
        return data
      })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function setAreaInState(area) {
  return {
    type: actions.SET_AREA,
    area
  }
}

export function setExpertjudgementInState(expertjudgement) {
  return {
    type: actions.SET_EXPERTJUDGEMENT,
    expertjudgement
  }
}

export function setConditionsInState(conditions) {
  return {
    type: actions.SET_CONDITIONS,
    conditions
  }
}

export function setLogInState(logs) {
  return {
    type: actions.SET_LOGS,
    logs
  }
}

export function setMeasureInstate(measure) {
  return {
    type: actions.SET_MEASURE,
    measure
  }
}

export function setSectionInState(section) {
  return {
    type: actions.SET_SECTION,
    section
  }
}

export function setSettingsInState(settings) {
  return {
    type: actions.SET_KBA_SETTINGS,
    settings
  }
}

export function setStationInState(station) {
  return {
    type: actions.SET_STATION,
    station
  }
}

export function setScenarioOptionsInState(options) {
  return {
    type: actions.SET_SCENARIO_OPTIONS,
    options
  }
}

export function setSimulationInState(simulation) {
  return {
    type: actions.SET_SIMULATION,
    simulation
  }
}

export function setWaterlevelsInState(waterlevels) {
  return {
    type: actions.SET_WATERLEVELS,
    waterlevels
  }
}