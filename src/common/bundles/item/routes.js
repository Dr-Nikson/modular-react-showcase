// @flow
import { sayWord } from 'common/bundles/pupper/redux/index'
import { bundle as pupperSubBundle } from './pupperSubBundle'
import type { GetRoutes } from 'react-async-bundles/types'

const fetchItemsData = (store, match) => {
  return Promise.resolve()
    .then(() => new Promise(resolve => setTimeout(resolve, 1500)))
    .then(() => store.dispatch(sayWord('Executing first')))
}

const fetchDetailsData = (store, match) => {
  return Promise.resolve().then(() => store.dispatch(sayWord('I AM BLOCKED')))
}

const getRoutes: GetRoutes = () => [
  { path: '/item', fetchData: fetchItemsData, fetchBlocking: true },
  { path: '/item/details', fetchData: fetchDetailsData },
  { path: '/item/p', bundle: pupperSubBundle },
]

export default getRoutes
