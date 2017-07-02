// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import BundleProvider from 'react-async-bundles/BundleProvider'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleStore } from 'react-async-bundles/types'

export const renderApp = (
  bundleStore: BundleStore,
  store: Object,
  history: Object,
  Component: ReactClass<any>
): void => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BundleProvider store={bundleStore}>
            <Component />
          </BundleProvider>
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}
