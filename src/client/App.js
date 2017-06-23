// @flow
import React, { PropTypes, PureComponent } from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from './Home'
import NotFound from 'common/components/NotFound'

class App extends PureComponent {
  static props: Object
  static defaultProps: Object

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

App.props = {}

App.defaultProps = {}

export default App
