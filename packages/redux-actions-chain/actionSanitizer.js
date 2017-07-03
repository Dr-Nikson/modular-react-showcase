// @flow
import type { ChainItem } from './types'

const actionSanitizer = (action: ChainItem | Object): Object =>
  action.chainName
    ? { ...action, type: `${action.chainName} > ${action.type}` }
    : action

export default actionSanitizer
