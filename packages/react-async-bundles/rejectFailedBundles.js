// @flow
import type { BundleMeta } from './types'


const extractErrors = (failedMetas: BundleMeta[]): any[] => {
  return failedMetas.map(meta =>
    meta.error || 'Cannot load bundle... no context after bundle loaded'
  )
}


const rejectFailedBundles = (metas: BundleMeta[]): Promise<BundleMeta[]> => {
  const failedBundles = metas.filter(
    (meta: BundleMeta): boolean => !!meta.error
  )

  return failedBundles.length > 0
    ? Promise.reject(extractErrors(failedBundles))
    : Promise.resolve(metas)
}

export default rejectFailedBundles
