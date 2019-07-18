import { getServices, getAppType, getWebServices } from '../async-actions/database/mangrove'

const fetch = require('node-fetch')
global.XMLHttpRequest = require("xhr2")
import * as actions from '../actions'

export function setApplicationConfig(path) {
  let url = encodeURI(`/static/config${path}/application.json`)
  if (process.env.type === 'app') {
    url = encodeURI(`static/config${path}/application.json`)
    return async function (dispatch) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest
        xhr.onload = function () {
          const json = JSON.parse(xhr.response)
          dispatch(setApplicationConfigInState(json))
          resolve(new Response(xhr.responseText, { status: 200, statusText: JSON.stringify(json) }))
        }
        xhr.open('GET', url)
        xhr.send(null)
      })
    }
  } else {
    return async function (dispatch) {
      return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(setApplicationConfigInState(json)))
        .then(json => { return json })
        .catch(function (error) {
          dispatch({ type: actions.SET_ERROR, error: error })
        })
    }
  }
}

export function setApplicationDetailConfig(path) {
  let url = encodeURI(`/static/config${path}/config.json`) 
  if (process.env.type === 'app') {
    url = encodeURI(`static/config${path}/config.json`)
    return async function (dispatch) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest
        xhr.onload = function () {
          const json = JSON.parse(xhr.response)
          dispatch(setApplicationConfigInState(json))
          resolve(new Response(xhr.responseText, { status: 200, statusText: JSON.stringify(json) }))
        }
        xhr.open('GET', url)
        xhr.send(null)
      })
    }
  } else {
    return async function (dispatch) {
      return fetch(url)        
        .then(response => response.json())        
        .then(json => dispatch(setApplicationConfigInState(json)))
        .then(json => { return json })
        .catch(function (error) {
          dispatch({ type: actions.SET_ERROR, error: error })
        })
    }
  }
}

export function setApplicationConfigInState(json) {
  const config = json.application[0]
  if (config.map) {

    config.map.baselayers.map(baselayer => {
      baselayer.url = baselayer.url
        .replace("{{services}}", getServices(process.env.webserver))
        .replace("{{geoservices}}", getWebServices(process.env.webserver))
        .replace("{{apptype}}", getAppType())
    })

    config.map.overlays.map(overlay => {
      overlay.url = overlay.url
        .replace("{{services}}", getServices(process.env.webserver))
        .replace("{{geoservices}}", getWebServices(process.env.webserver))
        .replace("{{apptype}}", getAppType())
    })
  }

  return {
    type: actions.SET_APPLICATION_CONFIG,
    config
  }
}