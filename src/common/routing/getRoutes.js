// @flow
import { bundle as itemBundle } from 'common/bundles/item/bundle'
import { shit } from 'common/bundles/test/some'
import type { RouteConfig } from 'common/routing/types'

const getRoutes = (): RouteConfig[] => [
  { path: '/item', bundle: itemBundle },
  { path: shit, component: true },
]

export default getRoutes
