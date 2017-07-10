// @flow
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleModule,
  HandleBundle,
} from './types'

const getEmptyRoutes = () => []

const defaultHandleModule: HandleBundle = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): BundleContext => ({
  ...route,
  component: bundleModule.default || bundleModule.component,
  getRoutes: bundleModule.getRoutes || getEmptyRoutes
})

export default defaultHandleModule
