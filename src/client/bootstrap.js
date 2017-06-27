// @flow
import createHistory from 'history/createBrowserHistory'

import getRoutes from 'common/routing/getRoutes'
import { loadAsyncBundles } from 'common/routing/bundleLoadingUtils'
import { renderApp } from './renderApp'
import { curry } from 'ramda'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { CurriedFunction2, CurriedFunction3 } from 'ramda'
import type { BundleContext } from 'common/routing/types'
import createStore from 'common/redux/createStore'

const history = createHistory()
const location = history.location
const url = location.pathname + location.search + location.hash

type RenderAppFunction = (component: ReactClass<any>) => void

const bootstrapApp = (): Promise<RenderAppFunction> => {
  return loadAsyncBundles(getRoutes(), url)
    .then((bundles: BundleContext[]): Function => {
      const render: Function = curry(renderApp)
      console.info('Bundles are loaded!')

      return (render(bundles): any)
    })
    .then((renderFn: Function): RenderAppFunction => {
      const initialState = window.__INITIAL_STATE__
      const store = createStore({ history, initialState })

      return renderFn(store, history)
    })
}

export default bootstrapApp
