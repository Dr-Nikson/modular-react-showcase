// @flow
import { bundle as itemBundle } from 'common/bundles/item/bundle'
import { bundle as pupperBundle } from 'common/bundles/pupper/bundle'
import { bundle as detailsBundle } from 'common/bundles/details/bundle'

import type { RouteConfig } from 'react-async-bundles/types'
import { someAsyncAction } from 'common/bundles/pupper/redux/index'

const fetchPupperData = (store, match) => {
  return store.dispatch(someAsyncAction())
}

const getRoutes = (): RouteConfig[] => [
  // { path: '/', fetchData: () => true },
  { path: '/item', bundle: itemBundle },
  { path: '/item/details', bundle: detailsBundle },
  { path: '/pupper', bundle: pupperBundle, fetchData: fetchPupperData },
  // { path: shit, component: true },
]

export default getRoutes
