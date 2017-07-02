// @flow
import type {
  AsyncRouteConfig,
  BundleContext,
  BundleModule,
  HandleBundle,
} from './types'


const loadAsyncBundle = (
  handleBundleModule: HandleBundle,
  asyncRoute: AsyncRouteConfig,
): Promise<BundleContext> =>
  asyncRoute.bundle
    .load()
    .then((bundleModule: BundleModule) =>
      handleBundleModule(asyncRoute, bundleModule)
    )

export default loadAsyncBundle
