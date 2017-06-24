// @flow
import { matchPath } from 'react-router-dom'

import type { BundleContext } from 'common/routing/types'
import type { RouteConfig, AsyncBundleConfig } from 'common/routing/routes'

const loadAsyncBundle = (route: AsyncBundleConfig) => {
  return route.loadBundle().then(component => ({
    ...route,
    component: component.default ? component.default : component,
  }))
}

const loadAsyncBundles = (
  routes: RouteConfig[],
  url: string
): Promise<BundleContext[]> => {
  const matched = Promise.all(
    routes
      .filter((route: any) => route.loadBundle && route.bundleName)
      .filter((route: any) => matchPath(url, route))
      .map((route: any) => (route: AsyncBundleConfig))
      .map(loadAsyncBundle)
  )

  return matched
}

export default loadAsyncBundles
