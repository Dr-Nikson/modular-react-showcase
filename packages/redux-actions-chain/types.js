// @flow

export type ActionType =
  | Object
  | Function

export type ChainItem = {
  chainName: string,
  type: string,
}

export type ActionsChain = {
  type: string,
  chain: Array<ActionType>
}

export type ChainableAction = ActionsChain & {
  add: (action: ActionType) => ChainableAction
}
