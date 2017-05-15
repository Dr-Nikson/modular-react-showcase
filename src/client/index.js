import React from 'react'
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import bar from 'client/some/coolStuff'

import App from 'client/App'

const renderApp = Component => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  )
}

renderApp(App);

// Hot Module Replacement API
if (module.hot) {
  console.info('MOD HOT')
  module.hot.accept('client/App', () => renderApp(App));
}


const text = 'Hello, world!'

export default function* myCode() {
  console.log('text')
  yield bar()

  return (
    <h1>Hello, world!</h1>
  )
}

console.log('App is ok!')
console.error('App is ok!')

myCode()

console.log('I"M ALIVE!!!')



