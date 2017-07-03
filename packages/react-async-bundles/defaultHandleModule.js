// @flow
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleModule,
  HandleBundle,
} from './types'


const defaultHandleModule: HandleBundle = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): BundleContext => ({
  ...route,
  component: bundleModule.default || bundleModule.component,
})

export default defaultHandleModule
