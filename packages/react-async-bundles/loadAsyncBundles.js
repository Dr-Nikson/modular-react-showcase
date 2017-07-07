// @flow
import { curry } from 'ramda'
import defaultHandleModule from 'react-async-bundles/defaultHandleModule'
import loadAsyncBundle from 'react-async-bundles/loadAsyncBundle'

import type {
  AsyncRouteConfig,
  BundleMeta,
  BundleStoreCreatorConfig,
} from './types'


const loadAsyncBundles = (
  config: BundleStoreCreatorConfig,
  url: string,
): Promise<BundleMeta>[] => {
  const {
    routes,
    matchPath,
    handleBundleModule = defaultHandleModule,
  } = config

  const finalLoadBundle = curry(loadAsyncBundle)(handleBundleModule)
  const promises = routes
    .filter(r => r.bundle && matchPath(url, r))
    .map(r => ((r: any): AsyncRouteConfig))
    .map(finalLoadBundle)

  return promises
}

export default loadAsyncBundles
