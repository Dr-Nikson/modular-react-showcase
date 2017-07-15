// @flow
import fetch from 'isomorphic-fetch'

export const fetchAllItems = () => {
  return (dispatch: any) =>
    fetch(`/api/items`)
      .then(r => r.json())
      .then(items => dispatch({ type: 'FETCH_ALL_SUCCESS', result: items }))
}
