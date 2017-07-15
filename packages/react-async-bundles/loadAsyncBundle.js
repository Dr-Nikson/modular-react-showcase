// @flow
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleMeta,
  BundleModule,
  HandleBundle,
} from './types'


const loadAsyncBundle = (
  handleBundleModule: HandleBundle,
  asyncRoute: AsyncRouteConfig,
): Promise<BundleMeta> =>
  asyncRoute.bundle
    .load()
    .then((bundleModule: BundleModule) =>
      handleBundleModule(asyncRoute, bundleModule)
    )
    .then((context: BundleContext): BundleMeta => ({
      context,
      name: asyncRoute.bundle.name,
    }))
    .catch((error: any): BundleMeta => ({
      error,
      name: asyncRoute.bundle.name,
    }))

export default loadAsyncBundle
