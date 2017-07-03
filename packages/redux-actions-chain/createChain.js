// @flow
import type { ActionType, ChainableAction } from './types'

const createChain = (name: string, actions: ActionType[] = []): ChainableAction => {
  return {
    type: name,
    chain: actions,
    add: (action: ActionType) => createChain(name, [...actions, action])
  }
}

export default createChain
