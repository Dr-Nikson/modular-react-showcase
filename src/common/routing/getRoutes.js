// @flow
import { bundle as itemBundle } from 'common/bundles/item/bundle'
import { bundle as pupperBundle } from 'common/bundles/pupper/bundle'

import type { RouteConfig } from 'react-async-bundles/types'

const getRoutes = (): RouteConfig[] => [
  { path: '/item', bundle: itemBundle },
  { path: '/pupper', bundle: pupperBundle },
]

export default getRoutes
