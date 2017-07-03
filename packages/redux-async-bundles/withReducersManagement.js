// @flow
import { combineReducers } from 'redux'
import type {
  Store,
  CombinedReducer,
  StoreCreator,
} from 'redux'

import type {
  ManageableStore,
  ManageableStoreCreator,
  ManageableStoreEnhancer,
  ReducersMap,
} from './types'


// TODO: try to replace <*, *> to <S, A>
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
