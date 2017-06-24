// @flow
import createHistory from 'history/createBrowserHistory'

import getRoutes from 'common/routing/routes'
import loadAsyncBundles from 'common/utils/loadAsyncBundles'
import { renderApp } from './renderApp'
import { curry } from 'ramda'

import type { CurriedFunction2 } from 'ramda'
import type { BundleContext } from 'common/routing/types'

const history = createHistory()
const location = history.location
const url = location.pathname + location.search + location.hash
const loadedBundles = getRoutes().filter(
  (route: any) => (window.__BUNDLES__: string[]).indexOf(route.bundleName) > -1
)

const bootstrapApp = (): Promise<Function> => {
  return loadAsyncBundles(
    getRoutes(),
    url
  ).then((bundles: BundleContext[]): Function => {
    const render: CurriedFunction2<BundleContext[], any, void> = curry(
      renderApp
    )
    console.info('Bundles are loaded!')

    return (render(bundles): any)
  })
}

export default bootstrapApp
