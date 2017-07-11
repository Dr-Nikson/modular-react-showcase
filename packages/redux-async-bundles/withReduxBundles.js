// @flow
import * as maybe from 'common/utils/maybe'
import handleReduxModule from 'redux-async-bundles/handleReduxModule'
import createSubscribersStore from 'subscribers-store/createSubscribersStore'

import type {
  BundleContext,
  BundleStore,
  BundleStoreCreatorConfig,
  CreateBundleStore,
  RouteConfig,
} from 'react-async-bundles/types'
import type { ManageableStore, ReduxBundle, ReduxBundleContext } from './types'
import type { SubscribersStore } from 'subscribers-store/types'


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
      let isLoading = false
      const subscribers: SubscribersStore = createSubscribersStore()
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


      const loadForUrl = (url: string): Promise<BundleContext[]> => {
        isLoading = true
        return bundleStore
          .loadForUrl(url)
          .then((bundles: BundleContext[]) => bundles.map(loadReduxModule))
          .then((bundles) => {
            isLoading = false
            realStoreSubscription()
            return bundles
          })
      }

      const realStoreSubscription = () => {
        return !isLoading && subscribers.notify()
      }

      bundleStore.subscribe(realStoreSubscription)
      // TODO: maybe we don't really need it:
      // reducers already loaded at this point (by inserting initial reducers)
      initialBundles.map(loadReduxModule)
      return {
        ...bundleStore,
        loadForUrl,
        subscribe: subscribers.subscribe
      }
    }
  }
}

export default withReduxBundles
