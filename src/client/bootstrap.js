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
  BundleStoreCreatorConfig,
} from 'react-async-bundles/types'

type RenderAppFunction = (component: ReactClass<any>) => void

const getUrl = (history: any) => {
  const location = history.location
  return location.pathname + location.search + location.hash
}

const muteFailedBundles = (
  promises: Promise<BundleContext>[]
): Promise<BundleContext[]> => {
  return Promise.all(
    promises.map(p => p.catch(console.error))
  ).then((bundles: Array<?BundleContext>): BundleContext[] => {
    return bundles.filter(b => !!b).map((b: any) => (b: BundleContext))
  })
}

const bootstrapApp = (): Promise<RenderAppFunction> => {
  const initialState = window.__INITIAL_STATE__
  const history = createHistory()
  const routes = getRoutes()

  const loaderConfig: BundleStoreCreatorConfig = {
    handleBundleModule: handleReduxModule,
    matchPath,
  }

  return (
    Promise.resolve()
      .then(() => loadBundlesForUrl(loaderConfig, routes, getUrl(history)))
      // For opposite to SSR we need to render the app even if some of the
      // bundles aren't successfully loaded (at least we can show error message)
      .then(muteFailedBundles)
      .then((initialBundles: BundleContext[]): Function => {
        console.info('Bundles are loaded!')

        const render: Function = curry(renderApp)
        const initialReducers = extractReducers(initialBundles)
        const store = createStore({ history, initialReducers, initialState })
        const createBundleStore = bundleStoreCreatorFactory(store)
        const bundleStore = createBundleStore(
          loaderConfig,
          routes,
          initialBundles
        )

        return (render(bundleStore, store, history): any)
      })
  )
}

export default bootstrapApp
