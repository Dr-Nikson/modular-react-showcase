// @flow
import type { Location, Match } from 'react-router-dom'
import type { Store } from 'redux'
import type { RefetchState } from './redux'

export type { RefetchActions, RefetchState, RefetchActionTypes } from './redux'


export type MatchedRouteProps = {
  match: Match,
  location: Location,
  // history?: Object,
}

export type FetchData = (
  store: Store<*, *>,
  data: MatchedRouteProps
) => Promise<*>

export type ReactRouteConfig ={
  path?: string,
  exact?: bool,
  strict?: bool,
}

export type PreFetchableRouteConfig = {
  path: string,
  fetchData: FetchData,
  fetchBlocking?: boolean,
}

export type FetcherRouteConfig = ReactRouteConfig | PreFetchableRouteConfig

export type MatchedRoute = {
  match: MatchedRouteProps,
  route: PreFetchableRouteConfig,
}

export type RefetchStateSelector = (state: Object) => RefetchState

