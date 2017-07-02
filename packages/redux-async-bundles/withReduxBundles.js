// @flow
import * as maybe from 'common/utils/maybe'

import type {
  AsyncRouteConfig,
  BundleContext,
  BundleModule,
  BundleStore,
  CreateBundleStore,
  RouteConfig,
} from 'react-async-bundles/types'
import type { ManageableStore, ReduxBundle } from './types'

type ReduxBundleModule<S, A> = BundleModule & {
  redux?: ReduxBundle<S, A>,
}

type ReduxBundleContext<S, A> = BundleContext & {
  redux?: ReduxBundle<S, A>,
}

const handleReduxModule = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): ReduxBundleContext<*, *> => ({
  ...route,
  component: (bundleModule: any).default || bundleModule.component,
  redux: ((bundleModule: any): ReduxBundleModule<*, *>).redux,
})

const withReduxBundles = (reduxStore: ManageableStore<*, *>) => {
  return (createBundleStore: CreateBundleStore) => {
    return (
      routes: RouteConfig[],
      matchPath: (path: string, route: any) => RouteConfig
    ): BundleStore => {
      const bundleStore = createBundleStore(
        routes,
        matchPath,
        handleReduxModule
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
        return bundleStore
          .loadForUrl(url)
          .then((bundles: BundleContext[]) => bundles.map(loadReduxModule))
      }

      return {
        ...bundleStore,
        load,
        loadForUrl,
      }
    }
  }
}

export default withReduxBundles
