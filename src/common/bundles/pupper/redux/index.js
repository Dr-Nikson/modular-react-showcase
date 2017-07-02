// @flow
import { values } from 'ramda'
import createReduxBundle from 'redux-async-bundles/createReduxBundle'

type DoSomethingActionType = 'DO_SOMETHING_GOOD'

export const actionTypes = {
  doSomething: 'DO_SOMETHING_GOOD',
}

type PupperState = {
  +count: number,
}

type PupperAction =
  | { type: DoSomethingActionType, payload: { count: number } }
  | { type: string }

const initialState: PupperState = {
  count: 0,
}

export const pupperReducer = (
  state: PupperState = initialState,
  action: PupperAction
): PupperState => {
  switch (action.type) {
    case 'DO_SOMETHING_GOOD':
      return { ...state, count: (action: any).payload.count }
    default:
      return state
  }
}

export const doGood = () => {
  return {
    type: 'DO_SOMETHING_GOOD',
    payload: { count: 12 },
  }
}

export default createReduxBundle(values(actionTypes), { pupper: pupperReducer })
