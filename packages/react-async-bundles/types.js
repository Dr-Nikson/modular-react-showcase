// @flow
// $FlowFixMe
import type { ReactClass } from 'react'
import type { Either } from 'flow-static-land/lib/Either'

export type BundleConfig = {
  name: string,
  load: () => Promise<any>,
}

export type SyncRouteConfig = {
  path: string,
  exact?: boolean,
  strict?: boolean,
}

export type AsyncRouteConfig = {
  path: string,
  bundle: BundleConfig,
}

export type RouteConfig = SyncRouteConfig | AsyncRouteConfig

export type GetRoutes = () => RouteConfig[]

export type BundleContext = {
  component: ReactClass<any>,
  bundle: BundleConfig,
  getRoutes: GetRoutes
}

export type ServerRenderContext = {
  url?: string,
  status?: number,
  bundles?: BundleContext[],
}

export type BundleStore = {
  invalidate: () => Promise<BundleMeta[]>,
  getBundle: (name: string) => Either<*, BundleContext>,
  getRoutes: () => RouteConfig[],
  loadForUrl: (url: string) => Promise<BundleMeta[]>,
  subscribe: (cb: Function) => Function,
}

export type HandleBundle = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
) => BundleContext

export type MatchPath = (path: string, route: any) => RouteConfig

export type BundleStoreCreatorConfig = {
  handleBundleModule?: HandleBundle,
  matchPath: MatchPath,
}

export type BundleMeta = {
  name: string,
  context?: BundleContext,
  error?: any,
}

export type BundlesMap = {
  [string]: BundleMeta,
}

export type CreateBundleStore = (
  config: BundleStoreCreatorConfig,
  initialRoutes: RouteConfig[],
  initialBundles: BundleMeta[],
) => BundleStore

export type BundleModule = {
  component: ReactClass<any>,
  getRoutes?: GetRoutes,
}

export type UrlSelector = (props: Object, context: Object) => string
