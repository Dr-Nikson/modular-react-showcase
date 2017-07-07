// @flow
import { routerReducer } from 'react-router-redux'
import refetchReducer from 'refetch/redux'
import type { ReducersMap } from 'redux-async-bundles/types'

const initialReducers: ReducersMap<*, *> = {
  router: routerReducer,
  refetch: refetchReducer,
}

export default initialReducers
