// @flow
import createHistory from 'history/createBrowserHistory'

import getRoutes from 'common/routing/getRoutes'
import { loadAsyncBundles } from 'common/routing/bundleLoadingUtils'
import { renderApp } from './renderApp'
import { curry } from 'ramda'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { CurriedFunction2 } from 'ramda'
import type { BundleContext } from 'common/routing/types'

const history = createHistory()
const location = history.location
const url = location.pathname + location.search + location.hash

type RenderAppFunction = (component: ReactClass<any>) => void
type CurriedRenderApp = CurriedFunction2<BundleContext[], ReactClass<any>, void>

const bootstrapApp = (): Promise<RenderAppFunction> => {
  return loadAsyncBundles(
    getRoutes(),
    url
  ).then((bundles: BundleContext[]): RenderAppFunction => {
    const render: CurriedRenderApp = curry(renderApp)
    console.info('Bundles are loaded!')

    return (render(bundles): any)
  })
}

export default bootstrapApp
