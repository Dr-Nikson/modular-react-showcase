// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import items from 'common/bundles/item/reducers/items'

const rootReducer = combineReducers({
  router: routerReducer,
  items,
})

export default rootReducer
