// @flow
import { bundle as itemBundle } from 'common/bundles/item/bundle'
import { bundle as pupperBundle } from 'common/bundles/pupper/bundle'
import { bundle as detailsBundle } from 'common/bundles/details/bundle'

import type { RouteConfig } from 'react-async-bundles/types'
import { someAsyncAction } from 'common/bundles/pupper/redux/index'
import { doGood } from 'common/bundles/pupper/redux/index'
import { sayWord, runForYourLife } from 'common/bundles/pupper/redux/index'

const fetchPupperData = (store, match) => {
  return (
    Promise.resolve()
      // .then(() => store.dispatch(someAsyncAction()))
      // .then(() => store.dispatch(doGood()))
      .then(() => Promise.all(store.dispatch(runForYourLife())))
  )
}

const fetchItemsData = (store, match) => {
  return Promise.resolve()
    .then(() => new Promise(resolve => setTimeout(resolve, 1500)))
    .then(() => store.dispatch(sayWord('Executing first')))
}

const fetchDetailsData = (store, match) => {
  return Promise.resolve().then(() => store.dispatch(sayWord('I AM BLOCKED')))
}

const getRoutes = (): RouteConfig[] => [
  // { path: '/', fetchData: () => true },
  {
    path: '/item',
    bundle: itemBundle,
    fetchData: fetchItemsData,
    fetchBlocking: true,
  },
  { path: '/item/details', bundle: detailsBundle, fetchData: fetchDetailsData },
  { path: '/pupper', bundle: pupperBundle, fetchData: fetchPupperData },
  // { path: shit, component: true },
]

export default getRoutes
