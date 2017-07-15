// @flow
import type { ActionCreator, Reducer } from 'redux'

type DataLoadedActionType = '@@refetch/dataLoaded'
type DataLoadedAction = {
  type: DataLoadedActionType,
  payload: { key: string, params?: Object }
}

export type RefetchActions =
  | DataLoadedAction
  | { type: string }


export type RefetchActionTypes = {
  [string]: DataLoadedActionType
}

export type RefetchState = {
  loadedLocations: { [string]: Object }
}

export const actionTypes: RefetchActionTypes = {
  dataLoaded: '@@refetch/dataLoaded'
}

const initialState: RefetchState = {
  loadedLocations: {}
}

export const dataLoaded: ActionCreator<DataLoadedAction, *> = (
  key: string,
  params: Object = {},
): DataLoadedAction => {

  return {
    type: actionTypes.dataLoaded,
    payload: { key, params }
  }
}

const refetchReducer: Reducer<RefetchState, RefetchActions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case actionTypes.dataLoaded:
      const { key, params } = ((action: any): DataLoadedAction).payload
      return {
        ...state,
        loadedLocations: {
          ...state.loadedLocations,
          [key]: { ...(state.loadedLocations[key] || {}), ...params }
        }
      }
    default:
      return state
  }
}

export default refetchReducer
