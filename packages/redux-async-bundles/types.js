// @flow
import type {
  Store,
  CombinedReducer,
  Reducer,
  StoreCreator,
  StoreEnhancer,
} from 'redux'
import type {
  BundleContext,
  BundleStore,
  BundleStoreCreatorConfig,
  BundleMeta,
  BundleModule,
  RouteConfig,
} from 'react-async-bundles/types'


export type ReducersMap<S, A> = {
  [string]: Reducer<S, A>,
}

type TestReduxBundle = (actionType: string) => boolean

export type ReduxBundle<S, A> = {
  test: TestReduxBundle,
  reducer: ReducersMap<S, A>,
}

export type ReduxBundleContext<S, A> = BundleContext & {
  redux?: ReduxBundle<S, A>,
}

export type ReduxBundleModule<S, A> = BundleModule & {
  redux?: ReduxBundle<S, A>,
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

export type CreateReduxBundleStore = (
  config: BundleStoreCreatorConfig,
  initialRoutes: RouteConfig[],
  initialBundles: BundleMeta[],
) => BundleStore
