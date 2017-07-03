// @flow
// $FlowFixMe
import type { ReactClass } from 'react'

export type BundleConfig = {
  name: string,
  load: () => Promise<any>,
}

export type BundleContext = {
  component: ReactClass<any>,
  bundle: BundleConfig,
}

export type ServerRenderContext = {
  url?: string,
  status?: number,
  bundles?: BundleContext[],
}

export type SyncRouteConfig = {
  path: string,
  component: ReactClass<any>,
}

export type AsyncRouteConfig = {
  path: string,
  bundle: BundleConfig,
}

export type RouteConfig = SyncRouteConfig | AsyncRouteConfig

export type BundleStore = {
  load: (name: string) => Promise<BundleContext>,
  getBundle: (name: string) => any, // TODO: fix type
}

export type HandleBundle = (
  route: AsyncRouteConfig,
  bundleModule: BundleModule
) => BundleContext

export type MatchPath = (path: string, route: any) => RouteConfig

export type BundleStoreCreatorConfig = {
  routes: RouteConfig[],
  handleBundleModule?: HandleBundle,
}

export type BundleUrlLoaderConfig =  BundleStoreCreatorConfig & {
  matchPath: MatchPath,
}

export type CreateBundleStore = (
  config: BundleStoreCreatorConfig,
  initialBundles: BundleContext[],
) => BundleStore

export type BundleModule = {
  // default: any,
  component?: ReactClass<any>,
}
