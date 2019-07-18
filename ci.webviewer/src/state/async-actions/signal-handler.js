export function addSignalHandler(view, { signalName, callback }) {
  return function (dispatch) {
    view.addSignalListener(signalName, callback)
  }
}

export function removeSignalHandler(view, { signalName, callback }) {
  return function (dispatch) {
    view.removeEventListener(signalName, callback)
  }
}

export function sendSignal(view, { signalName, value }) {    
  if (view.getState().signals.hasOwnProperty(signalName)){  
    return function (dispatch) {
      view.signal(signalName, value).run()
    }
  }
}

export function sendSignalByProperty(view, key, signalName, { name, value }) {
  return function (dispatch) {
    const record = dispatch(getDataObject(view, key, { name, value }))
    view.signal(signalName, record[0]).run()
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