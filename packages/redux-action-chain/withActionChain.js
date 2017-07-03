// @flow
import type { Reducer, Store, StoreCreator } from 'redux'
import type { ActionsChain } from './types'

const withActionChain = () => {
  return (createStore: StoreCreator<*, *>): StoreCreator<*, *> => {
    return (reducer: Reducer<*, *>, preloadedState: any, enhancer?: any) => {
      const store: Store<*, *> = createStore(reducer, preloadedState, enhancer)

      let currentListeners = []
      let nextListeners = currentListeners
      let isDispatching = false

      function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice()
        }
      }

      const subscribe = (listener: Function) => {
        if (typeof listener !== 'function') {
          throw new Error('Expected listener to be a function.')
        }

        let isSubscribed = true

        ensureCanMutateNextListeners()
        nextListeners.push(listener)

        return function unsubscribe() {
          if (!isSubscribed) {
            return
          }

          isSubscribed = false

          ensureCanMutateNextListeners()
          const index = nextListeners.indexOf(listener)
          nextListeners.splice(index, 1)
        }
      }

      const callListeners = () => {
        const listeners = currentListeners = nextListeners
        for (let i = 0; i < listeners.length; i++) {
          const listener = listeners[i]
          listener()
        }
      }

      const dispatch = (action: Object | ActionsChain) => {
        /*if (isDispatching) {
          throw new Error('Reducers may not dispatch actions.')
        }*/

        try {
          isDispatching = true

          if (!action.chain) {
            store.dispatch(action)
          } else {
            action.chain.map(subAction => {
              store.dispatch({ ...subAction, chainName: action.type || '' })
            })
          }

        } finally {
          isDispatching = false
        }

        callListeners()
        return (action: any)
      }


      return {
        ...store,
        dispatch,
        subscribe,
      }
    }
  }
}

export default withActionChain
