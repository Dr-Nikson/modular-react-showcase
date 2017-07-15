// @flow
import { flatten } from 'ramda'

import type {
  BundleContext,
  RouteConfig,
} from './types'


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

export default mergeRoutes
