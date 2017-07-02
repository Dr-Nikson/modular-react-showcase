// @flow

type TestReduxBundle = (actionType: string) => boolean
type ReduxBundleReducer = { [string]: Function }

export type ReduxBundle = {
  test: TestReduxBundle,
  reducer: ReduxBundleReducer,
}

const createReduxBundle = (
  actionTypes: string[],
  reducer: ReduxBundleReducer
): ReduxBundle => {
  return {
    test: (actionType: string): boolean => actionTypes.indexOf(actionType) > -1,
    reducer,
  }
}

export default createReduxBundle
