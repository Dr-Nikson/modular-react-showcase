// @flow
import type {
  Store,
  CombinedReducer,
  Reducer,
  StoreCreator,
  StoreEnhancer,
} from 'redux'
import type { RouteConfig, BundleStore } from 'react-async-bundles/types'


export type ReducersMap<S, A> = {
  [string]: Reducer<S, A>,
}

export type ManageableStore<S, A> = Store<S, A> & {
  addReducers: (reducers: ReducersMap<*, *>) => void,
}

export type ManageableStoreCreator<S, A> = (
  reducer: ReducersMap<S, A>,
  preloadedState: S,
  enhancer: ?StoreEnhancer<S, A>
) => ManageableStore<S, A>

export type ManageableStoreEnhancer<S, A> = (
  createStore: StoreCreator<S, A>
) => ManageableStoreCreator<S, A>

type TestReduxBundle = (actionType: string) => boolean

export type ReduxBundle<S, A> = {
  test: TestReduxBundle,
  reducer: ReducersMap<S, A>,
}

export type CreateReduxBundleStore = (
  routes: RouteConfig[],
  matchPath: (path: string, route: any) => RouteConfig
) => BundleStore
