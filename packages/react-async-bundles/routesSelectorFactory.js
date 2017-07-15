// @flow
import shallowEqual from 'shallowequal'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { identity } from 'ramda'

import mergeRoutes from './mergeRoutes'

import type {
  BundleContext,
  RouteConfig,
} from './types'


const createShallowSelector = createSelectorCreator(
  defaultMemoize,
  shallowEqual,
)

type RoutesSelector = (
  routes: RouteConfig[],
  contexts: BundleContext[]
) => RouteConfig[]

const routesSelectorFactory = (): RoutesSelector => createShallowSelector(
  mergeRoutes,
  identity,
)

export default routesSelectorFactory
