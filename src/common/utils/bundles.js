// @flow
import type { AsyncRouteConfig, BundleContext } from 'common/routing/types'

export const handleReduxModule = (
  route: AsyncRouteConfig,
  bundleModule: any
): BundleContext => ({
  ...route,
  component: bundleModule.default || bundleModule.component,
  redux: bundleModule.redux,
})
