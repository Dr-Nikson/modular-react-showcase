// @flow

type ItemsState = {
  +items: Object[],
}

type ItemsAction =
  | { type: 'FETCH_ALL_SUCCESS', result: Object[] }
  | { type: string }

const initialState: ItemsState = {
  items: [],
}

const itemsReducer = (
  state: ItemsState = initialState,
  action: ItemsAction
): ItemsState => {
  switch (action.type) {
    case 'FETCH_ALL_SUCCESS':
      return { ...state, items: [...state.items, ...(action: any).result] }
    default:
      return state
  }
}

export default itemsReducer
