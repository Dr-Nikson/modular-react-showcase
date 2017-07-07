// @flow
import type { BundleContext, BundleMeta } from './types'


const handleBundleMeta = (iterate: (m: BundleMeta) => any) => {
  return (p: Promise<BundleMeta>): Promise<BundleContext> => p
    .then((meta: BundleMeta) => {
      // TODO: maybe we need something like:
      // const finalMete = iterate(meta)
      iterate(meta)
      return meta.context
        ? meta.context
        : Promise.reject(
          meta.error || 'Cannot load bundle... no context after bundle loaded'
        )
    })
}

export default handleBundleMeta
