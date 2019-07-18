import { vega } from "vega-embed"
import * as actions from '../actions'

export function getVegaSpecification(path, specName) {
  let url = encodeURI(`/static/config${path}/${specName}.json`)
  if (process.env.type === 'app') {
    url = encodeURI(`static/config${path}/${specName}.json`)
    return async function (dispatch) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest
        xhr.onload = function() {
          const json = JSON.parse(xhr.response)
          dispatch(setSpecificationInState(json))
          resolve(new Response(xhr.responseText, {status: 200}))
        }
        xhr.open('GET', url)
        xhr.send(null)
      })
    }
  } else {
    return async function (dispatch) {
      return fetch(url)
        .then(response => response.json())
        .then(json => dispatch(setSpecificationInState(json)))
        .then(json => { return json })
        .catch(function (error) {
          dispatch({ type: actions.SET_ERROR, error: error })
        })
    }
  }
}

export function setSpecificationInState(specification) {
  return {
    type: actions.SET_VEGA_SPECIFICATION,
    specification
  }
}

export function getVegaData(view, key, url) {
  return async function (dispatch) {
    await fetch(url)
      .then(response => response.json())
      .then(json => dispatch(updateVegaData(view, key, json)))
  }
}

export function updateVegaData(view, key, data) {
  return async function (dispatch) {
    if (view) {
      await view.remove(key, view.data(key)).runAsync()
      await view.insert(key, data).runAsync()
      await dispatch({type: actions.DIALOG_LOADING_STATE, loading: false})
    }
  }
}

export function addSignalHandler(view, { signalName, callback }) {
  return function (dispatch) {
    if (view) {
      view.addSignalListener(signalName, callback)
    }
  }
}

export function removeSignalHandler(view, { signalName, callback }) {
  return function (dispatch) {
    if (view) {
      view.removeEventListener(signalName, callback)
    }
  }
}

export function sendSignal(view, { signalName, value }) {
  return async function (dispatch) {
    if (view) {
      if (view.getState().signals.hasOwnProperty(signalName)) {
        await view.signal(signalName, value).runAsync()
      }
    }
  }
}

export function sendDataSignal(view, { signalName, value }) {
  if (view.getState().signals.hasOwnProperty(signalName)){
    return async function (dispatch) {
      await view.signal(signalName, value).runAsync()
      await dispatch({ type: actions.DIALOG_LOADING_STATE, loading: false})
    }
  }
}

export function sendSignalByProperty(view, key, signalName, { name, value }) {
  return function (dispatch) {
    if (view) {
      const record = dispatch(getDataObject(view, key, { name, value }))
      view.signal(signalName, record[0]).runAsync()
    }
  }
}

export function getDataObject(view, key, { name, value }) {
  return function (dispatch) {
    if (view) {
      const data = view.data(key).slice()
      const record = data.filter(item => item.locatieid == value)
      return record
    }
  }
}