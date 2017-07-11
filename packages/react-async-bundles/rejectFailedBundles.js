// @flow
import type { BundleContext, BundleMeta } from './types'


const rejectFailedBundles = (metas: BundleMeta[]) => metas.map(
  (meta: BundleMeta): Promise<BundleContext> => {
    return meta.context
      ? Promise.resolve(meta.context)
      : Promise.reject(
        meta.error || 'Cannot load bundle... no context after bundle loaded'
      )
  }
)

export default rejectFailedBundles
