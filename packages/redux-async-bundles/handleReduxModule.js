// @flow
import handleAsyncModule from 'react-async-bundles/defaultHandleModule'

import type { AsyncRouteConfig, BundleModule } from 'react-async-bundles/types'
import type { ReduxBundleContext, ReduxBundleModule } from './types'



const handleReduxModule = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): ReduxBundleContext<*, *> => ({
  ...handleAsyncModule(route, bundleModule),
  redux: ((bundleModule: any): ReduxBundleModule<*, *>).redux,
})

export default handleReduxModule
