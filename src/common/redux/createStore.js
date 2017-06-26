// @flow
import { createStore, applyMiddleware } from 'redux'

import { Route } from 'react-router'

import { compose, identity } from 'ramda'
import thunkMiddleware from 'redux-thunk'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'

import rootReducer from './rootReducer'

export type StoreConfig = {
  history: any,
  initialState?: Object,
}

const isReduxDevToolsEnabled =
  // $FlowFixMe
  __DEVELOPMENT__ && __CLIENT__ && window.devToolsExtension
const storeFactory = (config: StoreConfig) => {
  const { history, initialState = {} } = config
  // Build the middleware for intercepting and dispatching navigation actions
  const middleware = [thunkMiddleware, routerMiddleware(history)]
  const enhancers = [
    isReduxDevToolsEnabled ? window.devToolsExtension() : identity,
  ]
  const finalCreateStore = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )(createStore)

  // Add the reducer to your store on the `router` key
  // Also apply our middleware for navigating
  const store = finalCreateStore(rootReducer, initialState)

  return store
}

export default storeFactory
