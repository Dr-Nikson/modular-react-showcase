// @flow
import React, { Component, PropTypes } from 'react'
import { Route } from 'react-router-dom'

import loadDataForUrl from './loadDataForUrl'
import { serverRenderLocationKey } from './locationUtils'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { ContextRouter, Location } from 'react-router-dom'
import type { FetcherRouteConfig, RefetchStateSelector } from './types'
import type { RefetchState } from './redux'


type DataFetcherWrapperProps = {
  children: ReactClass<*>,
  stateSelector?: RefetchStateSelector,
  routes: FetcherRouteConfig[],
}

type DataFetcherProps = DataFetcherWrapperProps & {
  routeProps: ContextRouter,
  stateSelector: RefetchStateSelector,
}

type DataFetcherState = {
  lastLoadedKey: string,
}


const isLocationAlreadyLoaded = (
  loadedLocations,
  target: Location
): boolean => (
  !!loadedLocations[target.key || '']
)

const isDataLoadedOnServer = (
  loadedLocations: Object,
  lastKey: string
): boolean => (
  lastKey === serverRenderLocationKey && !!loadedLocations[lastKey]
)


class DataFetcher extends Component<void, DataFetcherProps, DataFetcherState> {
  static contextTypes: Object
  static defaultProps: any

  state: DataFetcherState = {
    lastLoadedKey: serverRenderLocationKey
  }

  constructor(props: DataFetcherProps, context: Object) {
    super(props, context)

    if (!context.store) {
      throw new Error(
        'DataFetcher cannot find store in context. ' +
        'Probably you need to wrap it redux provider'
      )
    }
  }

  loadAsyncData = (props: DataFetcherProps) => {
    console.log('loadAsyncData')
    const { routes, stateSelector, routeProps } = props
    const { lastLoadedKey } = this.state
    const { store } = this.context
    const { location } = routeProps
    console.log('loadAsyncData.beforeStateSelect')
    const { loadedLocations } = stateSelector(store.getState())
    console.log('loadAsyncData.afterStateSelect')
    const locationAlreadyLoaded = (
      location.key !== lastLoadedKey &&
      isLocationAlreadyLoaded(loadedLocations, location)
    )

    console.log('loadAsyncData.middle')
    if (
      isDataLoadedOnServer(loadedLocations, lastLoadedKey)
      || locationAlreadyLoaded
    ) {
      this.setState({ lastLoadedKey: location.key || '' })
    } else {
      Promise
        .resolve()
        .then(() => loadDataForUrl(store, routes, location))
        .then(() => this.setState({ lastLoadedKey: location.key || '' }))
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.loadAsyncData(this.props)
  }

  componentWillReceiveProps(nextProps: DataFetcherProps) {
    const { location: { key: nextKey } } = nextProps.routeProps
    const { location: { key } } = this.props.routeProps
    console.log('componentWillReceiveProps')
    // note: state.lastLoadedKey shows last SUCCESSFULLY loaded location
    // as props.routeProps.location.key shows last rendered location
    if (key !== nextKey) {
      console.log('componentWillReceiveProps.insideIf')
      this.loadAsyncData(nextProps)
    }
  }

  render(): ReactClass<*> {
    return this.props.children
  }
}

DataFetcher.contextTypes = {
  store: PropTypes.object.isRequired,
}

DataFetcher.defaultProps = {
  stateSelector: (state: Object): RefetchState => state.refetch
}

const DataFetcherWrapper = (props: DataFetcherWrapperProps) => {
  // TODO: SOME STRANGE BEHAVIOUR with default props
  // (need to remove this velosiped)
  return (
    <Route>
      {(context) =>
        // $FlowFixMe
        <DataFetcher
          stateSelector={DataFetcher.defaultProps.stateSelector}
          {...props}
          routeProps={context}
        />
      }
    </Route>
  )
}

export default DataFetcherWrapper
