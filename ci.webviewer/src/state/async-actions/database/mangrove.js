import * as actions from '../../actions'

export function getAppType() {
  return process.env.apptype
}

export function getServices(server) {
  return `https://${server}.hkvservices.nl`
}

export function getWebServices(server) {
  switch (server) {
    case 'tsws':
      return `https://tsgeo.hkvservices.nl`

    case 'dmws':
      return `https://dmgeo.hkvservices.nl`

    default:
      return `https://geo.hkvservices.nl`
  }
}

export function getUrl(server, functionName, parameters) {
  parameters.apptype = getAppType()
  const service = getServices(server)
  return encodeURI(`${service}/mangrove.github.ws/entry.asmx/Call?function=${functionName}&parameters=${JSON.stringify(parameters)}`)
}

export function getAppInfo(server, appname, appid, ensembleid) {

  const parameters = {
    appid: appid,
    ensembleid: ensembleid
  }

  const functionName = `${appname}.appfunctions.getAppInfo`
  const url = getUrl(server, functionName, parameters)

  return async function (dispatch) {
    return await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(setAppInfoInState(json)))
      .then(json => { return json.appinfo })
      .catch(function (error) {
        dispatch({ type: actions.SET_ERROR, error: error })
      })
  }
}

export function basicFetchFunc(url) {
  return async function (dispatch) {
    return await fetch(url)
      .then(response => {return response.json()})
      .catch(function (error) {
        dispatch({type: actions.SET_ERROR, error: error})
      })
  }
}

export function setAppInfoInState(appinfo) {
  return {
    type: actions.SET_APP_INFO,
    appinfo
  }
}