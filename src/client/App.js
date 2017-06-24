// @flow
import React, { PropTypes, PureComponent } from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from './Home'
import NotFound from 'common/routing/components/NotFound'
import { ClientItemBundle } from 'common/bundles/item/bundle'
import Some from 'common/bundles/test/some'

class App extends PureComponent {
  static props: Object
  static defaultProps: Object

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/item" component={ClientItemBundle} />
          <Route exact path="/test" component={Some} />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

App.props = {}

App.defaultProps = {}

export default App
