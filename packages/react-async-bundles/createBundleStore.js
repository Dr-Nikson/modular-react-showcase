// @flow
import { Either } from 'ramda-fantasy'
// import * as maybe from 'flow-static-land/lib/Maybe'
import * as maybe from 'common/utils/maybe'
import { flatten, values } from 'ramda'
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
  initialRoutes: RouteConfig[],
  initialBundles: BundleContext[] = [],
): BundleStore => {
  const handleBundleModule = config.handleBundleModule || defaultHandleModule
  const bundles: BundlesMap = reduceToMap(initialBundles)
  const finalHandleMeta = handleBundleMeta(
    (meta: BundleMeta) => bundles[meta.name] = meta
  )

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

  const saveBundle = (asyncRoute: AsyncRouteConfig): Promise<BundleContext> =>
    finalHandleMeta(loadAsyncBundle(handleBundleModule, asyncRoute))

  const load = (name: string): Promise<BundleContext> => {
    const bundleContext: Maybe<Promise<BundleContext>> = maybe.map(
      saveBundle,
      findAsyncRoute(initialRoutes, name)
    )

    return maybe.getOrElse(bundleContext, () =>
      Promise.reject(
        new Error(`[BundleStore] Config not found for bundle [${name}]`)
      )
    )
  }

  const loadForRoutes = (
    routes: RouteConfig[],
    url: string
  ): Promise<BundleContext[]> => {
    const loadSubBundles = (p: Promise<BundleContext>) => p.then(
      (context: BundleContext) => {
        return context.getRoutes().length > 0
          ? loadForRoutes(context.getRoutes(), url).then(
            subContexts => [...subContexts, context]
          )
          : context
      }
    )

    const promises = loadAsyncBundles(config, routes, url)
      .map(finalHandleMeta)
      .map(loadSubBundles)

    return Promise.all(promises).then(flatten)
  }

  const loadForUrl = (url: string): Promise<BundleContext[]> => {
    const routes: RouteConfig[] = mergeRoutes(
      initialRoutes,
      getLoadedContexts()
    )
    const promises = loadForRoutes(routes, url)

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
