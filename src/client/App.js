// @flow
import React, { PropTypes, PureComponent } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import HomePage from './Home'

class App extends PureComponent {
  static props: Object
  static defaultProps: Object

  render() {
    return (
      <BrowserRouter>
        <div>
          App is good
          will it work, or i ... should WIIIN
          but..not now, bro
          IT IS STRANGE... where is all nice br's <br />
          god yeah!!!!!
          <br />
          So, let's dance!
          <Route exact path="/" component={HomePage} />
        </div>
      </BrowserRouter>
    )
  }
}

App.props = {}

App.defaultProps = {}

export default App
