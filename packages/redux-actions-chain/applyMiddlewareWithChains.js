// @flow
import type {
  Middleware,
  MiddlewareAPI,
  Reducer,
  Store,
  StoreCreator,
} from 'redux'
import type { ActionsChain } from './types'
import { compose } from 'redux'

const applyMiddlewareWithChains = (...middlewares: Middleware<*, *>[]) => {
  return (createStore: StoreCreator<*, *>): StoreCreator<*, *> => {
    return (reducer: Reducer<*, *>, preloadedState: any, enhancer?: any) => {
      const store: Store<*, *> = createStore(reducer, preloadedState, enhancer)

      let dispatchesInProgress: number = 0
      let currentListeners = []
      let nextListeners = currentListeners

      let dispatch = store.dispatch
      const middlewareAPI: MiddlewareAPI<*, *> = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      const dispatchToMiddleware = compose(...chain)(store.dispatch)

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

      const notifyAfterDispatch = () => {
        // if something happen with store outside of out dispatch method
        // for example - async action was fired from middleware
        if (dispatchesInProgress === 0) {
          callListeners()
        }
      }

      dispatch = (action: Function | Object | ActionsChain) => {
        // please notice - this method is executed before middlewares and store
        // so, we need to return result of dispatchToMiddleware
        let result: any = action
        try {
          dispatchesInProgress += 1

          if (!action.chain) {
            result = dispatchToMiddleware(action)
          } else {
            result = action.chain.map((subAction, idx) => {
              return dispatchToMiddleware(
                typeof subAction === 'function' || !!subAction.then
                  ? subAction
                  : {
                    ...subAction,
                    chainName: `Chain(${(action: any).type || ''})[${idx}]`,
                  }
              )
            })
          }
        }
        finally {
          dispatchesInProgress -= 1
        }

        notifyAfterDispatch()
        return (result: any)
      }

      store.subscribe(notifyAfterDispatch)
      return {
        ...store,
        dispatch,
        subscribe,
      }
    }
  }
}

export default applyMiddlewareWithChains
