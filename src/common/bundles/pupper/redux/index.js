// @flow
import { values } from 'ramda'
import createReduxBundle from 'redux-async-bundles/createReduxBundle'

type DoSomethingActionType = 'DO_SOMETHING_GOOD'
type SayWordActionType = 'SAY_WORD'

export const actionTypes = {
  doSomething: 'DO_SOMETHING_GOOD',
  sayWord: 'SAY_WORD',
}

type PupperState = {
  +count: number,
  +word: string,
}

type PupperAction =
  | { type: DoSomethingActionType, payload: { count: number } }
  | { type: SayWordActionType, payload: { word: string } }
  | { type: string }

const initialState: PupperState = {
  count: 1,
  word: 'initial',
}

export const pupperReducer = (
  state: PupperState = initialState,
  action: PupperAction
): PupperState => {
  switch (action.type) {
    case 'DO_SOMETHING_GOOD':
      return { ...state, count: state.count + (action: any).payload.count }
    case 'SAY_WORD':
      return { ...state, word: state.word + ',' + (action: any).payload.word }
    default:
      return state
  }
}

export const doGood = () => {
  return {
    type: 'DO_SOMETHING_GOOD',
    payload: { count: 1 },
  }
}

export const sayWord = () => {
  const words = ['hi, my', 'name', 'chickkky-ckickky', 'slim shady']

  return {
    type: actionTypes.sayWord,
    payload: { word: words[Math.floor(Math.random() * words.length)] },
  }
}

export const runForYourLife = () => {
  return {
    type: 'runForYourLife',
    chain: [doGood(), sayWord()],
  }
}

export default createReduxBundle(values(actionTypes), { pupper: pupperReducer })
