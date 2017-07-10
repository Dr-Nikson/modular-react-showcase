// @flow
import loadAsyncBundles from 'react-async-bundles/loadAsyncBundles'
import handleBundleMeta from 'react-async-bundles/handleBundleMeta'
import { identity } from 'ramda'

import type {
  BundleContext,
  BundleStoreCreatorConfig,
  RouteConfig,
} from './types'


const loadBundlesForUrl = (
  config: BundleStoreCreatorConfig,
  routes: RouteConfig[],
  url: string,
): Promise<BundleContext>[] => {
  const promises = loadAsyncBundles(config, routes, url)
    .map(handleBundleMeta(identity))

  return promises
}

export default loadBundlesForUrl
