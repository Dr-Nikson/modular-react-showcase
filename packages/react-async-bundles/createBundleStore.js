// @flow
import { Either } from 'ramda-fantasy'
import { flatten, values } from 'ramda'
import createSubscribersStore from 'subscribers-store/createSubscribersStore'
import loadAsyncBundles from './loadAsyncBundles'
import rejectFailedBundles from './rejectFailedBundles'

import type { SubscribersStore } from 'subscribers-store/types'
import type {
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

  const loadForUrl = (url: string): Promise<BundleContext[]> => {
    const routes: RouteConfig[] = getRoutes()

    return loadAsyncBundles(config, routes, url)
      .then((bundlesMeta: BundleMeta[]) => bundlesMeta.map(handleMeta))
      .then(rejectFailedBundles)
      .then(bundles => Promise.all(bundles))
      .then((bundles) => {
        subscribers.notify()
        return bundles
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
    // load,
    loadForUrl,
    getBundle,
    getRoutes,
    subscribe: subscribers.subscribe,
  }
}

export default createBundleStore
