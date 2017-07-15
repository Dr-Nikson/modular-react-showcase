// @flow
import type { ReduxBundle, ReducersMap } from './types'


const createReduxBundle = (
  actionTypes: string[],
  reducer: ReducersMap<*, *>
): ReduxBundle<*, *> => {
  return {
    test: (actionType: string): boolean => actionTypes.indexOf(actionType) > -1,
    reducer,
  }
}

export default createReduxBundle
