// @flow
import createHistory from 'history/createBrowserHistory'
import { curry } from 'ramda'

import getRoutes from 'common/routing/getRoutes'
import createStore from 'common/redux/createStore'
import { renderApp } from './renderApp'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { CurriedFunction2, CurriedFunction3 } from 'ramda'
import type { BundleContext } from 'common/routing/types'
import createBundleStore from 'common/routing/createBundleStore'
import { handleReduxModule } from 'common/utils/bundles'
import { matchPath } from 'react-router-dom'

const history = createHistory()
const location = history.location
const url = location.pathname + location.search + location.hash

type RenderAppFunction = (component: ReactClass<any>) => void

const bootstrapApp = (): Promise<RenderAppFunction> => {
  const bundleStore = createBundleStore(
    getRoutes(),
    matchPath,
    handleReduxModule
  )
  return bundleStore
    .loadForUrl(url)
    .then((): Function => {
      const render: Function = curry(renderApp)
      console.info('Bundles are loaded!')

      return (render(bundleStore): any)
    })
    .then((renderFn: Function): RenderAppFunction => {
      const initialState = window.__INITIAL_STATE__
      const store = createStore({ history, initialState })

      return renderFn(store, history)
    })
}

export default bootstrapApp
