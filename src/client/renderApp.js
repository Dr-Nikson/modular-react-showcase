// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import BundleProvider from 'common/routing/components/BundleProvider'
import getRoutes from 'common/routing/getRoutes'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleContext } from 'common/routing/types'

export const renderApp = (
  bundles: BundleContext[],
  store: Object,
  history: Object,
  Component: ReactClass<any>
): void => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BundleProvider bundles={bundles} routes={getRoutes()}>
            <Component />
          </BundleProvider>
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}
