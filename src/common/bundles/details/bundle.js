// @flow
import { asyncBundle } from 'common/utils/bundle'
import type { BundleConfig } from 'react-async-bundles/types'

const name: string = 'details-bundle'
// prettier-ignore
const load: Function = () => new Promise(resolve => setTimeout(resolve, 1500))
  .then(() => import(/* webpackChunkName: "details-bundle" */ 'common/bundles/details/DetailsComponent'))

export const bundle: BundleConfig = {
  name,
  load,
}

export const DetailsBundle = asyncBundle(name)
