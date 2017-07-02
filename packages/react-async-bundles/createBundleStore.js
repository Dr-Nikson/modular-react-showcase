// @flow
import { Either } from 'ramda-fantasy'
// import * as maybe from 'flow-static-land/lib/Maybe'
import * as maybe from 'common/utils/maybe'
import defaultHandleModule from './defaultHandleModule'
import loadAsyncBundle from './loadAsyncBundle'

import type { Maybe } from 'flow-static-land/lib/Maybe'
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleStore,
  BundleStoreCreatorConfig,
  CreateBundleStore,
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

const reduceToMap = (bundles: BundleContext[]): BundlesMap =>
  bundles
    .reduce(
      (res: BundlesMap, context: BundleContext) => ({
        ...res,
        [context.bundle.name]: { context }
      }),
      {}
    )

const createBundleStore: CreateBundleStore = (
  config: BundleStoreCreatorConfig,
  initialBundles: BundleContext[] = [],
): BundleStore => {
  const { routes } = config
  const handleBundleModule = config.handleBundleModule || defaultHandleModule
  const bundles: BundlesMap = reduceToMap(initialBundles)

  const saveBundle = (
    asyncRoute: AsyncRouteConfig
  ): Promise<BundleContext> => loadAsyncBundle(handleBundleModule, asyncRoute)
      .then((context: BundleContext) => {
        bundles[asyncRoute.bundle.name] = { context }
        return context
      })
      .catch(error => {
        bundles[asyncRoute.bundle.name] = { error }
        return Promise.reject(error)
      })

  const load = (name: string): Promise<BundleContext> => {
    const bundleContext: Maybe<Promise<BundleContext>> = maybe.map(
      saveBundle,
      findAsyncRoute(routes, name)
    )

    return maybe.getOrElse(bundleContext, () =>
      Promise.reject(
        new Error(`[BundleStore] Config not found for bundle [${name}]`)
      )
    )
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
    getBundle,
  }
}

export default createBundleStore
