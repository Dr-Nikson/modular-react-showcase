// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import { BundleProvider } from 'common/utils/bundle'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleStore } from 'react-async-bundles/types'
import DataFetcher from 'refetch/DataFetcher'
import getRoutes from 'common/routing/getRoutes'

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
            <DataFetcher routes={getRoutes()}>
              <Component />
            </DataFetcher>
          </BundleProvider>
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}
