// @flow
import type { BundleMeta } from './types'


export const rejectFailedBundle = (
  meta: BundleMeta
): Promise<BundleMeta> => {
  return meta.context
    ? Promise.resolve(meta)
    : Promise.reject(
      meta.error || 'Cannot load bundle... no context after bundle loaded'
    )
}


const rejectFailedBundles = (metas: BundleMeta[]): Promise<BundleMeta>[] =>
  metas.map(rejectFailedBundle)

export default rejectFailedBundles
