// @flow
import loadAsyncBundles from './loadAsyncBundles'

import type {
  BundleMeta,
  BundleStoreCreatorConfig,
  RouteConfig,
} from './types'

// TODO: we don't need it anymore?
const loadBundlesForUrl = (
  config: BundleStoreCreatorConfig,
  routes: RouteConfig[],
  url: string,
): Promise<BundleMeta[]> => {
  const promises = loadAsyncBundles(config, routes, url)
  return promises
}

export default loadBundlesForUrl
