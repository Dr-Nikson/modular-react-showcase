// @flow
import {
  loadBundle as loadItemBundle,
  bundleName as ItemBundleName,
} from 'common/bundles/item/bundle'
import { shit } from 'common/bundles/test/some'

export type SyncBundleConfig = {
  path: string,
  component: any,
}

export type AsyncBundleConfig = {
  path: string,
  bundleName: string,
  loadBundle: Function,
}

export type RouteConfig = SyncBundleConfig | AsyncBundleConfig

const getRoutes = (): RouteConfig[] => [
  { path: '/item', bundleName: ItemBundleName, loadBundle: loadItemBundle },
  { path: shit, component: true },
]

export default getRoutes
