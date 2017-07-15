// @flow
import bootstrap from './bootstrap'
import App from 'client/App'

console.info('Client bundle is started')

bootstrap().then(renderApp => {
  console.info('Application bootstrapped')
  renderApp(App)
  console.info('Application rendered')
})
