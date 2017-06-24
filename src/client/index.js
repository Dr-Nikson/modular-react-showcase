// @flow
import { renderApp } from './renderApp'
import bootstrap from './bootstrap'

import App from 'client/App'

bootstrap(App)

if (module.hot) {
  console.log('MOD HOT')

  let prevStatus = ''
  // $FlowFixMe
  module.hot.addStatusHandler(status => {
    console.log('[HMR] status', status)

    if (status === 'idle' && status !== prevStatus) {
      renderApp(App)
    }
    prevStatus = status
  })
}

console.log('App is ok!', 'AHAHAHHAHA')
console.log('I"M ALIVE!!!')
