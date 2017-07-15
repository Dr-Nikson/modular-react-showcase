// @flow

export type SubscribersStore = {
  subscribe: (cb: Function) => Function,
  notify: () => void,
}
