// @flow
import type { Dispatch, Store } from 'redux'

const promiseMiddleware = (store: Store<*, *>) => {
  return (next: Dispatch<*>) => (action: Object) => {
    const { promise, types, ...rest } = action

    if (!promise) {
      return next(action)
    }

    if (!types) {
      return promise
    }

    const [REQUEST, SUCCESS, FAILURE] = types
    next({ ...rest, type: REQUEST })
    return promise
      .then(result => {
        next({ ...rest, result, type: SUCCESS })
        return result
      })
      .catch(error => {
        next({ ...rest, error, type: FAILURE })
        return Promise.reject(error)
      })
  }
}

export default promiseMiddleware
