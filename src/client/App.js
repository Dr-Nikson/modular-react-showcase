// @flow
import React, { PureComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Link, withRouter } from 'react-router-dom'

import HomePage from './Home'
import NotFound from 'common/routing/components/NotFound'
import { ItemBundle } from 'common/bundles/item/bundle'
import { PupperBundle } from 'common/bundles/pupper/bundle'
import Some from 'common/bundles/test/some'

class App extends PureComponent {
  static props: Object
  static defaultProps: Object

  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/item">Item (async)</Link></li>
          <li><Link to="/item/details">Item (async) > Details</Link></li>
          <li><Link to="/item/pupper">Item (async) > Pupper</Link></li>
          <li><Link to="/pupper">Supper-pupper!</Link></li>
          <li><Link to="/test">Redirect test</Link></li>
        </ul>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/item" component={ItemBundle} />
          <Route path="/pupper" component={PupperBundle} />
          <Route exact path="/test" component={Some} />
          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}

App.props = {}

App.defaultProps = {}

export default withRouter((App: any))
