// @flow
import { runForYourLife } from 'common/bundles/pupper/redux/index'
import type { GetRoutes } from 'react-async-bundles/types'

const fetchPupperData = (store, match) => {
  return (
    Promise.resolve()
      // .then(() => store.dispatch(someAsyncAction()))
      // .then(() => store.dispatch(doGood()))
      .then(() => Promise.all(store.dispatch(runForYourLife())))
  )
}

const getRoutes: GetRoutes = () => [
  { path: '/pupper', fetchData: fetchPupperData },
]

export default getRoutes
