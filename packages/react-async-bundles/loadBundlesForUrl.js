// @flow
import { curry } from 'ramda'
import defaultHandleModule from 'react-async-bundles/defaultHandleModule'
import loadAsyncBundle from 'react-async-bundles/loadAsyncBundle'

import type {
  AsyncRouteConfig,
  BundleContext,
  BundleUrlLoaderConfig,
} from './types'



const loadBundlesForUrl = (
  config: BundleUrlLoaderConfig,
  url: string,
): Promise<BundleContext[]> => {
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

  return Promise.all(promises)
}

export default loadBundlesForUrl
