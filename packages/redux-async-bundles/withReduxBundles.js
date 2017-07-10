// @flow
import * as maybe from 'common/utils/maybe'
import handleReduxModule from 'redux-async-bundles/handleReduxModule'

import type {
  BundleContext,
  BundleStore,
  BundleStoreCreatorConfig,
  CreateBundleStore,
  RouteConfig,
} from 'react-async-bundles/types'
import type { ManageableStore, ReduxBundle, ReduxBundleContext } from './types'


const withReduxBundles = (reduxStore: ManageableStore<*, *>) => {
  return (createBundleStore: CreateBundleStore) => {
    return (
      config: BundleStoreCreatorConfig,
      initialRoutes: RouteConfig[],
      initialBundles: BundleContext[] = [],
    ): BundleStore => {
      const finalConfig = {
        ...config,
        handleBundleModule: handleReduxModule
      }
      const bundleStore = createBundleStore(
        finalConfig,
        initialRoutes,
        initialBundles,
      )

      const loadReduxModule = (context: BundleContext): BundleContext => {
        // Add reducer to ManageableStore
        maybe.map(
          (redux: ReduxBundle<*, *>) => reduxStore.addReducers(redux.reducer),
          maybe.inj(((context: any): ReduxBundleContext<*, *>).redux)
        )
        return context
      }

      const load = (name: string): Promise<BundleContext> => {
        return bundleStore.load(name).then(loadReduxModule)
      }

      const loadForUrl = (url: string): Promise<BundleContext[]> => {
        return bundleStore.loadForUrl(url).then(
          (bundles: BundleContext[]) => bundles.map(loadReduxModule)
        )
      }

      // TODO: maybe we don't really need it:
      // reducers already loaded at this point (by inserting initial reducers)
      initialBundles.map(loadReduxModule)
      return {
        ...bundleStore,
        load,
        loadForUrl,
      }
    }
  }
}

export default withReduxBundles
