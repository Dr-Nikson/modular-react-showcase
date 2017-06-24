// @flow
import createHistory from 'history/createBrowserHistory'

import getRoutes from 'common/routing/routes'
import loadAsyncBundles from 'common/utils/loadAsyncBundles'
import { renderApp } from './renderApp'

const history = createHistory()
const location = history.location
const url = location.pathname + location.search + location.hash
const loadedBundles = getRoutes().filter(
  (route: any) => (window.__BUNDLES__: string[]).indexOf(route.bundleName) > -1
)

const bootstrapApp = (App: any) => {
  return loadAsyncBundles(getRoutes(), url).then(bundles => {
    console.info('Bundles are loaded!')
    renderApp(App, bundles)
  })
}

export default bootstrapApp
