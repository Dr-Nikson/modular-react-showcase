// @flow
import { compose } from 'ramda'
import createBundleStore from 'common/routing/createBundleStore'
import withReduxBundles from 'common/redux/withReduxBundles'
import type { ManageableStore } from 'common/redux/withReducersManagement'
import type { CreateReduxBundleStore } from 'common/redux/withReduxBundles'

const bundleStoreCreatorFactory = (
  reduxStore: ManageableStore<*, *>
): CreateReduxBundleStore => {
  const finalCreateBundleStore: CreateReduxBundleStore = compose(
    withReduxBundles(reduxStore)
  )(createBundleStore)

  return finalCreateBundleStore
}

export default bundleStoreCreatorFactory
