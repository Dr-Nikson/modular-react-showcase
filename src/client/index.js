// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import bar from 'client/some/coolStuff'

import App from 'client/App'

const renderApp = Component => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
  )
}

renderApp(App)

// Hot Module Replacement API
if (module.hot) {
  console.info('MOD HOT')
  // $FlowFixMe
  module.hot.accept('client/App', () => renderApp(App))
}

const text = 'Hello, world!'

function* myCode() {
  console.log('text')
  yield bar()

  return <h1>Hello, world!</h1>
}

function testFlow(r: number) {
  return Math.max(r, 112)
}

console.log('App is ok! gag gagagagaag', testFlow(123))

myCode()

console.log('I"M ALIVE!!!')
