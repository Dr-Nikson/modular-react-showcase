// @flow
import * as maybe from 'common/utils/maybe'

import type {
  BundleModule,
  CreateBundleStore,
} from 'common/routing/createBundleStore'
import type {
  AsyncRouteConfig,
  BundleContext,
  RouteConfig,
} from 'common/routing/types'
import type { ReduxBundle } from 'common/redux/createReduxBundle'
import type { BundleStore } from 'common/routing/createBundleStore'
import type { ManageableStore } from 'common/redux/withReducersManagement'

type ReduxBundleModule = BundleModule & {
  redux?: ReduxBundle,
}

type ReduxBundleContext = BundleContext & {
  redux?: ReduxBundle,
}

export type CreateReduxBundleStore = (
  routes: RouteConfig[],
  matchPath: (path: string, route: any) => RouteConfig
) => BundleStore

const handleReduxModule = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
): ReduxBundleContext => ({
  ...route,
  component: (bundleModule: any).default || bundleModule.component,
  redux: ((bundleModule: any): ReduxBundleModule).redux,
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
          (redux: ReduxBundle) => reduxStore.addReducers(redux.reducer),
          maybe.inj(((context: any): ReduxBundleContext).redux)
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
