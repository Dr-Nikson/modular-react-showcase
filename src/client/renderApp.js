// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import BundleProvider from 'common/routing/components/BundleProvider'
import getRoutes from 'common/routing/getRoutes'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleContext } from 'common/routing/types'

export const renderApp = (
  bundles: BundleContext[],
  Component: ReactClass<any>
): void => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <BundleProvider bundles={bundles} routes={getRoutes()}>
          <Component />
        </BundleProvider>
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
  )
}
