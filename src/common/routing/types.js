// @flow
// $FlowFixMe
import type { ReactClass } from 'react'

export type BundleContext = {
  // name: string,
  component: ReactClass<any>,
  loadBundle: () => Promise<any>,
}

export type ServerRenderContext = {
  url?: string,
  status?: number,
  bundles?: BundleContext[],
}
