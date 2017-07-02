// @flow
import { compose } from 'ramda'
import createBundleStore from 'react-async-bundles/createBundleStore'
import withReduxBundles from 'redux-async-bundles/withReduxBundles'
import type {
  CreateReduxBundleStore,
  ManageableStore,
} from 'redux-async-bundles/types'

const bundleStoreCreatorFactory = (
  reduxStore: ManageableStore<*, *>
): CreateReduxBundleStore => {
  const finalCreateBundleStore: CreateReduxBundleStore = compose(
    withReduxBundles(reduxStore)
  )(createBundleStore)

  return finalCreateBundleStore
}

export default bundleStoreCreatorFactory
