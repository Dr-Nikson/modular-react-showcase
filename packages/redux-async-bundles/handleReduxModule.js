// @flow
import type { AsyncRouteConfig, BundleModule } from 'react-async-bundles/types'
import type { ReduxBundleContext, ReduxBundleModule } from './types'



const handleReduxModule = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): ReduxBundleContext<*, *> => ({
  ...route,
  component: (bundleModule: any).default || bundleModule.component,
  redux: ((bundleModule: any): ReduxBundleModule<*, *>).redux,
})

export default handleReduxModule
