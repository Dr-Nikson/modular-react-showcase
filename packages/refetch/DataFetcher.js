// @flow
import React, { Component, PropTypes } from 'react'
import { Route } from 'react-router-dom'

import loadDataForUrl from './loadDataForUrl'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { ContextRouter, Location } from 'react-router-dom'
import type { FetcherRouteConfig, MatchedRouteProps } from 'refetch/types'

type DataFetcherProps = {
  children: ReactClass<*>,
  routes: FetcherRouteConfig[],
}

type DataFetcherState = {
  loadedLocationKey: string,
}




class DataFetcher extends Component<void, DataFetcherProps, DataFetcherState> {
  static contextTypes: Object
  state: DataFetcherState = {
    loadedLocationKey: ''
  }

  renderRoute = (routeProps: ContextRouter): ReactClass<*> => {
    const { children, routes } = this.props
    const { loadedLocationKey } = this.state
    const { store } = this.context
    const { location } = routeProps

    if (location.key !== loadedLocationKey) {
      Promise
        .resolve()
        .then(() => loadDataForUrl(store, routes, location))
        .then(() => this.setState({ loadedLocationKey: location.key }))
    }

    return children
  }

  render() {
    return (
      <Route render={this.renderRoute} />
    )
  }
}

DataFetcher.contextTypes = {
  store: PropTypes.object.isRequired,
}

export default DataFetcher
