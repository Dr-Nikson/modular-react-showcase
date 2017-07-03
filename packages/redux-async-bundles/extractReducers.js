// @flow
import type { BundleContext } from 'react-async-bundles/types'
import type { ReducersMap, ReduxBundle, ReduxBundleContext } from './types'

const concatReducers = (reducers, bundle: ReduxBundle<*, *>) => ({
  ...reducers,
  ...bundle.reducer,
})

const extractReducers = (bundles: BundleContext[]): ReducersMap<*, *> => {
  return bundles
    .filter((b: any) => b.redux)
    .map((context: any) => (context: ReduxBundleContext<*, *>).redux)
    .reduce(concatReducers, {})
}

export default extractReducers