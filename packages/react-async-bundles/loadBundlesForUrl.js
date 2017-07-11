// @flow
import loadAsyncBundles from './loadAsyncBundles'
import rejectFailedBundles from './rejectFailedBundles'

import type {
  BundleContext,
  BundleStoreCreatorConfig,
  RouteConfig,
} from './types'


const loadBundlesForUrl = (
  config: BundleStoreCreatorConfig,
  routes: RouteConfig[],
  url: string,
): Promise<Promise<BundleContext>[]> => {
  const promises = loadAsyncBundles(config, routes, url)
    .then(rejectFailedBundles)

  return promises
}

export default loadBundlesForUrl
