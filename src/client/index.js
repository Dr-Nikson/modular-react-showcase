// @flow
import bootstrap from './bootstrap'
import App from 'client/App'

console.info('Client bundle is started')

bootstrap().then(renderApp => {
  console.info('Application bootstrapped')
  renderApp(App)
  console.info('Application rendered')

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
})
