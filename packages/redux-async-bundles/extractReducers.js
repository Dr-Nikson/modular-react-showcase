// @flow
import type { BundleMeta } from 'react-async-bundles/types'
import type { ReducersMap, ReduxBundle, ReduxBundleContext } from './types'

const concatReducers = (reducers, bundle: ReduxBundle<*, *>) => ({
  ...reducers,
  ...bundle.reducer,
})

const extractReducers = (bundles: BundleMeta[]): ReducersMap<*, *> => {
  return bundles
    .filter((b: any) => b.context && b.context.redux)
    .map((b: any) =>  b.context)
    .map((context: any) => (context: ReduxBundleContext<*, *>).redux)
    .reduce(concatReducers, {})
}

export default extractReducers