// @flow
import { matchPath } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { curry } from 'ramda'

import getRoutes from 'common/routing/getRoutes'
import createStore from 'common/redux/createStore'
import { renderApp } from './renderApp'
import bundleStoreCreatorFactory from 'common/routing/bundleStoreCreatorFactory'
import loadBundlesForUrl from 'react-async-bundles/loadBundlesForUrl'
import handleReduxModule from 'redux-async-bundles/handleReduxModule'
import extractReducers from 'redux-async-bundles/extractReducers'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { CurriedFunction2, CurriedFunction3 } from 'ramda'
import type {
  BundleContext,
  BundleUrlLoaderConfig,
} from 'react-async-bundles/types'

type RenderAppFunction = (component: ReactClass<any>) => void

const getUrl = (history: any) => {
  const location = history.location
  return location.pathname + location.search + location.hash
}

const bootstrapApp = (): Promise<RenderAppFunction> => {
  const initialState = window.__INITIAL_STATE__
  const history = createHistory()
  const routes = getRoutes()

  const loaderConfig: BundleUrlLoaderConfig = {
    routes,
    handleBundleModule: handleReduxModule,
    matchPath,
  }

  return loadBundlesForUrl(
    loaderConfig,
    getUrl(history)
  ).then((initialBundles: BundleContext[]): Function => {
    console.info('Bundles are loaded!')

    const render: Function = curry(renderApp)
    const initialReducers = extractReducers(initialBundles)
    const store = createStore({ history, initialReducers, initialState })
    const createBundleStore = bundleStoreCreatorFactory(store)
    const bundleStore = createBundleStore({ routes }, initialBundles)

    return (render(bundleStore, store, history): any)
  })
}

export default bootstrapApp
