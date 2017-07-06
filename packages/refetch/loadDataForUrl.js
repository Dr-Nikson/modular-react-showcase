// @flow
// $FlowFixMe
import { groupBy, startsWith } from 'ramda'
import { matchPath } from 'react-router-dom'
import { getUrlFromLocation } from './locationUtils'

import type { Store } from 'redux'
import type { Location, Match } from 'react-router-dom'
import type {
  FetcherRouteConfig,
  MatchedRoute,
  PreFetchableRouteConfig,
} from './types'


type GroupedMatches = { roots?: MatchedRoute[], children?: MatchedRoute[] }
type LoadWithBlocked = (
  promises: Promise<any>[],
  blocked: MatchedRoute[],
) => Promise<any[]>



const isRoot = (
  target: MatchedRoute,
  matchedRoutes: MatchedRoute[]
): boolean => {
  return matchedRoutes.reduce(
    (res, r) => target === r
      ? res
      : res && !startsWith(r.route.path, target.route.path)
    ,
    true
  )
}

const loadData = (
  store: Store<*, *>,
  matchedRoutes: MatchedRoute[]
): Promise<*>[] => {
  const { roots = [], children = [] }: GroupedMatches = groupBy(
    m => isRoot(m, matchedRoutes) ? 'roots' : 'children',
    matchedRoutes
  )
  const isRootBlocking = roots.some(m => m.route.fetchBlocking)
  const rootPromises = roots.map(m => m.route.fetchData(store, m.match))

  const loadWithBlocked: LoadWithBlocked = (promises, blockedRoutes) => {
    return Promise
      .all(promises)
      .then(
        results => Promise
          .all(loadData(store, blockedRoutes))
          .then(subResults => [...results, ...subResults])
      )
  }
  const loadDataForChildren = (matched: MatchedRoute[]): Promise<*>[] => {
    return matched.length > 0 ? loadData(store, children) : []
  }

  return isRootBlocking
    ? [loadWithBlocked(rootPromises, children)]
    : [...rootPromises, ...loadDataForChildren(children)]
}


const loadDataForUrl = (
  store: Store<*, *>,
  routes: FetcherRouteConfig[],
  location: Location,
): Promise<*> => {
  const matched: MatchedRoute[] = routes
    .filter((route: FetcherRouteConfig) => !!(route: any).fetchData)
    .map((route: FetcherRouteConfig): Object => {
      const matchResult = matchPath(getUrlFromLocation(location), (route: any))
      return {
        match: matchResult && {
          match: matchResult,
          location,
        },
        route: ((route: any): PreFetchableRouteConfig)
      }
    })
    .filter(matched => !!matched.match)

  const promises = loadData(store, matched)

  return Promise.all(promises)
}

export default loadDataForUrl
