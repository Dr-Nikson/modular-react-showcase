// @flow
import { Either } from 'ramda-fantasy'
// import * as maybe from 'flow-static-land/lib/Maybe'
import * as maybe from 'common/utils/maybe'
import defaultHandleModule from './defaultHandleModule'
import loadAsyncBundle from './loadAsyncBundle'
import loadAsyncBundles from './loadAsyncBundles'
import handleBundleMeta from './handleBundleMeta'

import type { Maybe } from 'flow-static-land/lib/Maybe'
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleMeta,
  BundlesMap,
  BundleStore,
  BundleStoreCreatorConfig,
  CreateBundleStore,
  RouteConfig,
} from './types'



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
      (res: BundlesMap, context: BundleContext): BundlesMap => ({
        ...res,
        [context.bundle.name]: { context, name: context.bundle.name }
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
  const finalHandleMeta = handleBundleMeta(
    (meta: BundleMeta) => bundles[meta.name] = meta
  )

  const saveBundle = (asyncRoute: AsyncRouteConfig): Promise<BundleContext> =>
    finalHandleMeta(loadAsyncBundle(handleBundleModule, asyncRoute))

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

  const loadForUrl = (url: string): Promise<BundleContext>[] => {
    const promises = loadAsyncBundles(config, url).map(finalHandleMeta)

    return promises
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
