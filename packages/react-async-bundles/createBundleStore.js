// @flow
import { Either } from 'ramda-fantasy'
import { curry, values } from 'ramda'
import createSubscribersStore from 'subscribers-store/createSubscribersStore'

import loadAsyncBundle from './loadAsyncBundle'
import loadAsyncBundles from './loadAsyncBundles'
import defaultHandleModule from './defaultHandleModule'
import routesSelectorFactory from './routesSelectorFactory'

import type { SubscribersStore } from 'subscribers-store/types'
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

const reduceToMap = (bundles: BundleMeta[]): BundlesMap => bundles.reduce(
  (res: BundlesMap, meta: BundleMeta): BundlesMap => ({
    ...res,
    [meta.name]: meta
  }),
  {}
)

const createBundleStore: CreateBundleStore = (
  config: BundleStoreCreatorConfig,
  initialRoutes: RouteConfig[],
  initialBundles: BundleMeta[] = [],
): BundleStore => {
  const bundles: BundlesMap = reduceToMap(initialBundles)
  const subscribers: SubscribersStore = createSubscribersStore()
  const handleMeta = (meta: BundleMeta) => bundles[meta.name] = meta
  const handleBundleModule = config.handleBundleModule || defaultHandleModule
  const selectRoutes = routesSelectorFactory()


  const notifyAfterLoading = (p: Promise<BundleMeta[]>) => p.then(
    (metas: BundleMeta[]): BundleMeta[] => {
      subscribers.notify()
      return metas
    },
    (error: any): any => {
      subscribers.notify()
      return Promise.reject(error)
    }
  )

  const getLoadedContexts = (): BundleContext[] => {
    return values(bundles)
      .filter((meta: BundleMeta): boolean => !!meta.context)
      .map((meta: any): BundleContext => meta.context)
  }

  const getRoutes = (): RouteConfig[] => {
    return selectRoutes(initialRoutes, getLoadedContexts())
  }

  const loadForRoutes = (
    routes: RouteConfig[],
    url: string
  ): Promise<BundleMeta[]> => {
    return notifyAfterLoading(
      loadAsyncBundles(config, routes, url)
        .then((bundlesMeta: BundleMeta[]) => bundlesMeta.map(handleMeta))
    )
  }

  const loadForUrl = (url: string): Promise<BundleMeta[]> => {
    const routes: RouteConfig[] = getRoutes()
      .filter((r: RouteConfig) => (
        r.bundle && !(bundles[r.bundle.name] && bundles[r.bundle.name].context)
      ))
    return loadForRoutes(routes, url)
  }

  const invalidate = (): Promise<BundleMeta[]> => {
    // TODO: SOMEHOW type is failed here
    // $FlowFixMe
    const finalLoadBundle: Function =
      curry(loadAsyncBundle)(handleBundleModule)
    // TODO: let's use Map instead of object... or not?
    Object.keys(bundles).map(k => delete bundles[k])

    const routes = getRoutes()
    const promises: Promise<BundleMeta>[] = routes
      .filter((r: any) => !!r.bundle)
      .map(r => ((r: any): AsyncRouteConfig))
      .map(finalLoadBundle)
      .map((bundleMeta: Promise<BundleMeta>) => bundleMeta.then(handleMeta))

    return notifyAfterLoading(Promise.all(promises))
  }

  // TODO: fix type --> migrate to flow-static-land
  const getBundle = (name: string): any => {
    const bundleMeta: ?BundleMeta = bundles[name]

    return bundleMeta && bundleMeta.error
      ? Either.Left(bundleMeta.error)
      : Either.Right(bundleMeta && bundleMeta.context)
  }


  return {
    invalidate,
    getBundle,
    getRoutes,
    // load,
    loadForUrl,
    subscribe: subscribers.subscribe,
  }
}

export default createBundleStore
