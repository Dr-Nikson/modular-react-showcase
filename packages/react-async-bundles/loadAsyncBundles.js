// @flow
import { curry, flatten } from 'ramda'
import defaultHandleModule from 'react-async-bundles/defaultHandleModule'
import loadAsyncBundle from 'react-async-bundles/loadAsyncBundle'

import type {
  AsyncRouteConfig,
  BundleMeta,
  BundleStoreCreatorConfig,
  RouteConfig,
} from './types'


const loadAsyncBundles = (
  config: BundleStoreCreatorConfig,
  routes: RouteConfig[],
  url: string,
): Promise<BundleMeta[]> => {
  const {
    matchPath,
    handleBundleModule = defaultHandleModule,
  } = config

  const loadSubBundles = (routes: RouteConfig[]): Promise<BundleMeta[]> =>
    routes.length > 0
      ? loadAsyncBundles(config, routes, url)
      : Promise.resolve([])


  const handleSubBundles = (p: Promise<BundleMeta>): Promise<BundleMeta[]> => {
    return p.then((meta: BundleMeta): Promise<BundleMeta[]> => {
      const { context } = meta

      return loadSubBundles(context ? context.getRoutes() : [])
        .then((subMeta: BundleMeta[]) => [meta, ...subMeta])
    })
  }

  // TODO: SOMEHOW type is failed here
  // $FlowFixMe
  const finalLoadBundle: Function = curry(loadAsyncBundle)(handleBundleModule)
  const promises: Promise<BundleMeta[]>[] = routes
    .filter(r => r.bundle && matchPath(url, r))
    .map(r => ((r: any): AsyncRouteConfig))
    .map(finalLoadBundle)
    .map(handleSubBundles)

  // TODO: somehow BundleMeta[][] isn't working for this case...
  return Promise.all(promises).then((metaArrays: any[]) => {
    return flatten(metaArrays)
  })
}

export default loadAsyncBundles
