// @flow
import { Either } from 'ramda-fantasy'
import { curry, flatten, values } from 'ramda'
import createSubscribersStore from 'subscribers-store/createSubscribersStore'

import loadAsyncBundle from './loadAsyncBundle'
import loadAsyncBundles from './loadAsyncBundles'
import rejectFailedBundles, { rejectFailedBundle } from './rejectFailedBundles'
import defaultHandleModule from './defaultHandleModule'

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
  initialRoutes: RouteConfig[],
  initialBundles: BundleContext[] = [],
): BundleStore => {
  const bundles: BundlesMap = reduceToMap(initialBundles)
  const subscribers: SubscribersStore = createSubscribersStore()
  const handleMeta = (meta: BundleMeta) => bundles[meta.name] = meta
  const handleBundleModule = config.handleBundleModule || defaultHandleModule

  const mergeRoutes = (
    routes: RouteConfig[],
    contexts: BundleContext[]
  ): RouteConfig[] => {
    // TODO: how to fix this?! OMG, it's so annoying
    const tmp: any[] = contexts
      .map((c: BundleContext): RouteConfig[] => c.getRoutes())

    return [
      ...routes,
      ...flatten(tmp)
    ]
  }

  const getLoadedContexts = (): BundleContext[] => {
    return values(bundles)
      .filter((meta: BundleMeta): boolean => !!meta.context)
      .map((meta: any): BundleContext => meta.context)
  }

  const getRoutes = (): RouteConfig[] => {
    return mergeRoutes(initialRoutes, getLoadedContexts())
  }

  const loadForRoutes = (
    routes: RouteConfig[],
    url: string
  ): Promise<BundleContext[]> => {
    return loadAsyncBundles(config, routes, url)
      .then((bundlesMeta: BundleMeta[]) => bundlesMeta.map(handleMeta))
      .then(rejectFailedBundles)
      .then(bundles => Promise.all(bundles))
      .then((bundles) => {
        subscribers.notify()
        return bundles
      })
  }

  const loadForUrl = (url: string): Promise<BundleContext[]> => {
    const routes: RouteConfig[] = getRoutes()
    return loadForRoutes(routes, url)
  }

  const invalidate = (): Promise<BundleContext[]> => {
    // TODO: SOMEHOW type is failed here
    // $FlowFixMe
    const finalLoadBundle: Function =
      curry(loadAsyncBundle)(handleBundleModule)

    const routes = getRoutes()
    const promises: Promise<BundleContext>[] = routes
      .filter((r: any) => !!r.bundle)
      .map(r => ((r: any): AsyncRouteConfig))
      .map(finalLoadBundle)
      .map(
        (bundleMeta: Promise<BundleMeta>) => bundleMeta
          .then(handleMeta)
          .then(rejectFailedBundle)
      )

    return Promise.all(promises).then(contexts => {
      subscribers.notify()
      return contexts
    })
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
