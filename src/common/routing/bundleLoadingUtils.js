// @flow
import { matchPath } from 'react-router-dom'

import type { BundleContext } from 'common/routing/types'
import type { RouteConfig, AsyncRouteConfig } from 'common/routing/types'

// TODO: unit tests for this
export const loadAsyncBundle = (
  route: AsyncRouteConfig
): Promise<BundleContext> => {
  return route.bundle.load().then(component => ({
    ...route,
    component: component.default ? component.default : component,
  }))
}

export const loadAsyncBundles = (
  routes: RouteConfig[],
  url: string
): Promise<BundleContext[]> => {
  const matched = Promise.all(
    routes
      .filter((route: any) => !!route.bundle)
      .filter((route: any) => matchPath(url, route))
      .map((route: any) => (route: AsyncRouteConfig))
      .map(loadAsyncBundle)
  )

  return matched
}
