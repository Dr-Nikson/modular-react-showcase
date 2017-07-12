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
): BundleContext => {
  const context = {
    ...route,
    component: bundleModule.default || bundleModule.component,
    getRoutes: bundleModule.getRoutes || getEmptyRoutes
  }

  if (!context.component) {
    // TODO: Change it to functional style
    throw new Error(
      'You should specify component for async bundle: '
      + `path[${route.path}] name[${route.bundle.name}]`
    )
  }

  return context
}

export default defaultHandleModule
