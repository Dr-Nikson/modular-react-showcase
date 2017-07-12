// @flow
import { matchPath } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { curry } from 'ramda'

import getRoutes from 'common/routing/getRoutes'
import createStore from 'common/redux/createStore'
import { renderApp } from './renderApp'
import App from 'client/App'
import bundleStoreCreatorFactory from 'common/routing/bundleStoreCreatorFactory'
import loadBundlesForUrl from 'react-async-bundles/loadBundlesForUrl'
import handleReduxModule from 'redux-async-bundles/handleReduxModule'
import extractReducers from 'redux-async-bundles/extractReducers'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { CurriedFunction2, CurriedFunction3 } from 'ramda'
import type {
  BundleContext,
  BundleMeta,
  BundleStoreCreatorConfig,
} from 'react-async-bundles/types'
import hotReloadHook from 'client/hotReloadHook'

type RenderAppFunction = (component: ReactClass<any>) => void

const getUrl = (history: any) => {
  const location = history.location
  return location.pathname + location.search + location.hash
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
      .then((initialBundles: BundleMeta[]): Function => {
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

        const renderer = () => (render(bundleStore, store, history, App): any)

        hotReloadHook(module, bundleStore.invalidate)
        bundleStore.subscribe(() => renderer())

        return renderer
      })
  )
}

export default bootstrapApp
