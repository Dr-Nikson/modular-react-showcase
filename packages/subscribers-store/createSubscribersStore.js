// @flow
import type { SubscribersStore } from './types'

const createSubscribersStore = (): SubscribersStore => {
  let currentListeners = []
  let nextListeners = currentListeners

  const ensureCanMutateNextListeners = () => {
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

  const notify = () => {
    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  return {
    subscribe,
    notify,
  }
}

export default createSubscribersStore
