// @flow
import { routerReducer } from 'react-router-redux'

import type { ReducersMap } from 'common/redux/withReducersManagement'

const initialReducers: ReducersMap<*, *> = {
  router: routerReducer,
}

export default initialReducers
