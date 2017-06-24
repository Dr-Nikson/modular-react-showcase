// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import App from 'client/App'

export const renderApp = (Component: any, bundles: string[] = []) => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
  )
}

// Hot Module Replacement API
/*if (module.hot) {
  console.info('MOD HOT')

  // $FlowFixMe
  module.hot.accept('client/App', () => renderApp(App))
}*/
