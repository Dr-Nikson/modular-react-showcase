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
