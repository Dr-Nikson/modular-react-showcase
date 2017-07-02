// @flow
import createHistory from 'history/createBrowserHistory'
import { curry } from 'ramda'

import getRoutes from 'common/routing/getRoutes'
import createStore from 'common/redux/createStore'
import { renderApp } from './renderApp'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { CurriedFunction2, CurriedFunction3 } from 'ramda'
import { matchPath } from 'react-router-dom'
import bundleStoreCreatorFactory from 'common/routing/bundleStoreCreatorFactory'

type RenderAppFunction = (component: ReactClass<any>) => void

const getUrl = (history: any) => {
  const location = history.location
  return location.pathname + location.search + location.hash
}

const bootstrapApp = (): Promise<RenderAppFunction> => {
  const initialState = window.__INITIAL_STATE__
  const history = createHistory()

  const store = createStore({ history, initialState })
  const createBundleStore = bundleStoreCreatorFactory(store)
  const bundleStore = createBundleStore(getRoutes(), matchPath)

  return bundleStore.loadForUrl(getUrl(history)).then((): Function => {
    const render: Function = curry(renderApp)
    console.info('Bundles are loaded!')

    return (render(bundleStore, store, history): any)
  })
}

export default bootstrapApp
