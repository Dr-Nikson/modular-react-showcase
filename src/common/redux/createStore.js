// @flow
import { createStore } from 'redux'
import { Route } from 'react-router'
import { compose, identity } from 'ramda'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import withReducersManagement from 'redux-async-bundles/withReducersManagement'
import { applyMiddlewareWithChains, actionSanitizer } from 'redux-actions-chain'
import defaultReducers from './defaultReducers'

import type {
  ManageableStore,
  ManageableStoreCreator,
  ReducersMap,
} from 'redux-async-bundles/types'

export type StoreConfig<S, A> = {
  history: any,
  initialState?: Object,
  initialReducers: ReducersMap<S, A>,
}

const isReduxDevToolsEnabled =
  // $FlowFixMe
  __DEVELOPMENT__ && __CLIENT__ && window.devToolsExtension
const storeFactory = (config: StoreConfig<*, *>): ManageableStore<*, *> => {
  const { history, initialState = {}, initialReducers } = config
  // Build the middleware for intercepting and dispatching navigation actions
  const middleware = [thunkMiddleware, routerMiddleware(history)]
  // change StoreCreator signature to
  // (reducersMap, stateObject, enhancer?) => ManageableStore
  const finalCreateStore: ManageableStoreCreator<*, *> = compose(
    withReducersManagement(),
    applyMiddlewareWithChains(...middleware),
    // applyMiddleware(...middleware),
    isReduxDevToolsEnabled
      ? window.devToolsExtension({ actionSanitizer })
      : identity
  )(createStore)

  // Add the reducer to your store on the `router` key
  // Also apply our middleware for navigating
  const store: ManageableStore<*, *> = finalCreateStore(
    { ...defaultReducers, ...initialReducers },
    initialState
  )

  return store
}

export default storeFactory
