// @flow
import { combineReducers } from 'redux'
import type {
  Store,
  CombinedReducer,
  Reducer,
  StoreCreator,
  StoreEnhancer,
} from 'redux'

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

const withReducersManagement = (): ManageableStoreEnhancer<*, *> => {
  return (createStore: StoreCreator<*, *>): ManageableStoreCreator<*, *> => {
    return (
      initialReducers: ReducersMap<*, *>,
      preloadedState: Object,
      enhancer?: any
    ): ManageableStore<*, *> => {
      let reducers: ReducersMap<*, *> = initialReducers
      const store: Store<*, *> = createStore(
        combineReducers(reducers),
        preloadedState,
        enhancer
      )

      const addReducers = (additionalReducers: ReducersMap<*, *>) => {
        reducers = { ...reducers, ...additionalReducers }
        store.replaceReducer(combineReducers(reducers))
      }

      return {
        ...store,
        addReducers,
      }
    }
  }
}

export default withReducersManagement
