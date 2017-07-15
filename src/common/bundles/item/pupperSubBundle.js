// @flow
import { bundle as pupperBundle } from 'common/bundles/pupper/bundle'
import { asyncBundle } from 'common/utils/bundle'

import type { BundleModule } from 'react-async-bundles/types'

const name = 'items' + pupperBundle.name

export const bundle = {
  name,
  load: (...args: any[]) =>
    pupperBundle.load(...args).then((module: BundleModule) => {
      return {
        ...module,
        getRoutes: () => {
          return module.getRoutes
            ? module.getRoutes().map(r => ({ ...r, path: '/item' + r.path }))
            : []
        },
      }
    }),
}

export const PupperSubBundle = asyncBundle(name)
