// @flow
import fetch from 'isomorphic-fetch'
import { values } from 'ramda'
import pupperReduxBundle, { doGood } from 'common/bundles/pupper/redux/index'
import createReduxBundle from 'redux-async-bundles/createReduxBundle'

type ItemsState = {
  +items: Object[],
}

type FetchSuccessType = 'FETCH_ALL_SUCCESS'
const fetchSuccess: FetchSuccessType = 'FETCH_ALL_SUCCESS'

export const actionTypes = {
  fetchSuccess: fetchSuccess,
}

type ItemsAction =
  | { type: FetchSuccessType, result: Object[] }
  | { type: string }

const initialState: ItemsState = {
  items: [],
}

export const itemsReducer = (
  state: ItemsState = initialState,
  action: ItemsAction
): ItemsState => {
  switch (action.type) {
    case fetchSuccess:
      return { ...state, items: [...state.items, ...(action: any).result] }
    default:
      return state
  }
}

export const fetchAllItems = () => {
  return (dispatch: any) =>
    fetch(`/api/items`).then(r => r.json()).then(items => {
      dispatch({ type: 'FETCH_ALL_SUCCESS', result: items })
      doGood()
      return items
    })
}

export default createReduxBundle(values(actionTypes), {
  ...pupperReduxBundle.reducer,
  items: itemsReducer,
})
