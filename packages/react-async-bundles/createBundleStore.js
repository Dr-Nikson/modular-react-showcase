// @flow
import { Either } from 'ramda-fantasy'
// import * as maybe from 'flow-static-land/lib/Maybe'
import * as maybe from 'common/utils/maybe'

import type { Maybe } from 'flow-static-land/lib/Maybe'
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleModule,
  BundleStore,
  CreateBundleStore,
  HandleBundle,
  RouteConfig,
} from './types'



type BundleMeta = {
  context?: BundleContext,
  error?: any,
}

type BundlesMap = {
  [string]: BundleMeta,
}


// TODO: unit tests for this
const defaultHandleModule = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): BundleContext => ({
  ...route,
  component: bundleModule.default || bundleModule.component,
})

const findAsyncRoute = (
  routes: RouteConfig[],
  name: string
): Maybe<AsyncRouteConfig> => {
  const route = routes
    .filter((r: any) => !!r.bundle)
    .map((r: any) => (r: AsyncRouteConfig))
    .find(r => r.bundle.name === name)

  return route ? maybe.of(route) : maybe.Nothing
}

const createBundleStore: CreateBundleStore = (
  routes: RouteConfig[],
  matchPath: (path: string, route: any) => RouteConfig,
  handleBundleModule: HandleBundle = defaultHandleModule
): BundleStore => {
  const bundles: BundlesMap = {}

  const loadAsyncBundle = (
    asyncRoute: AsyncRouteConfig
  ): Promise<BundleContext> =>
    asyncRoute.bundle
      .load()
      .then((bundleModule: BundleModule) =>
        handleBundleModule(asyncRoute, bundleModule)
      )
      .then((context: BundleContext) => {
        bundles[asyncRoute.bundle.name] = { context }
        return context
      })
      .catch(error => {
        bundles[asyncRoute.bundle.name] = { error }
        return Promise.reject(error)
      })

  const load = (name: string): Promise<BundleContext> => {
    const config: Maybe<Promise<BundleContext>> = maybe.map(
      loadAsyncBundle,
      findAsyncRoute(routes, name)
    )

    return maybe.getOrElse(config, () =>
      Promise.reject(
        new Error(`[BundleStore] Config not found for bundle [${name}]`)
      )
    )
  }

  const loadForUrl = (url: string): Promise<BundleContext[]> => {
    const promises = routes
      .filter(r => r.bundle && matchPath(url, r))
      .map(r => ((r: any): AsyncRouteConfig))
      .map(loadAsyncBundle)

    return Promise.all(promises)
  }

  // TODO: fix type
  const getBundle = (name: string): any => {
    const bundleMeta: ?BundleMeta = bundles[name]

    return bundleMeta && bundleMeta.error
      ? Either.Left(bundleMeta.error)
      : Either.Right(bundleMeta && bundleMeta.context)
  }

  return {
    load,
    loadForUrl,
    getBundle,
  }
}

export default createBundleStore
