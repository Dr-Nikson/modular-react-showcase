// @flow
import { routerReducer } from 'react-router-redux'
import type { ReducersMap } from 'redux-async-bundles/types'

const initialReducers: ReducersMap<*, *> = {
  router: routerReducer,
}

export default initialReducers
