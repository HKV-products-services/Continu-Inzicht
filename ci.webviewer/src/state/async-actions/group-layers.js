import * as actions from '../actions'

export function setActive(groupId) {
  return function (dispatch) {
    dispatch({ type: actions.SHOW_GROUP_LAYER, groupId })
  }
}

export function setInActive(groupId) {
  return function (dispatch) {
    dispatch({ type: actions.HIDE_GROUP_LAYER, groupId })
  }
}