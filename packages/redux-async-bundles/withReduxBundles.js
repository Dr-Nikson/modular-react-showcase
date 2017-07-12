// @flow
import * as maybe from 'common/utils/maybe'
import handleReduxModule from 'redux-async-bundles/handleReduxModule'
import createSubscribersStore from 'subscribers-store/createSubscribersStore'

import type {
  BundleContext,
  BundleMeta,
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
      initialBundles: BundleMeta[] = [],
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


      const notifyAfterLoading = (p: Promise<BundleMeta[]>) => p.then(
        (metas: BundleMeta[]): BundleMeta[] => {
          isLoading = false
          subscribers.notify()
          return metas
        },
        (error: any): any => {
          isLoading = false
          subscribers.notify()
          return Promise.reject(error)
        },
      )

      const loadReduxModule = (meta: BundleMeta): BundleMeta => {
        const { context } = meta
        // Add reducer to ManageableStore
        maybe.map(
          (redux: ReduxBundle<*, *>) => reduxStore.addReducers(redux.reducer),
          maybe.inj(
            context && ((context: any): ReduxBundleContext<*, *>).redux
          )
        )
        return meta
      }

      const loadForUrl = (url: string): Promise<BundleMeta[]> => {
        isLoading = true
        return notifyAfterLoading(
          bundleStore
            .loadForUrl(url)
            .then((metas: BundleMeta[]) => metas.map(loadReduxModule))
        )
      }

      const invalidate = (): Promise<BundleMeta[]> => {
        isLoading = true
        return notifyAfterLoading(
          bundleStore
            .invalidate()
            .then((metas: BundleMeta[]) => metas.map(loadReduxModule))
        )
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
        invalidate,
        loadForUrl,
        subscribe: subscribers.subscribe
      }
    }
  }
}

export default withReduxBundles
