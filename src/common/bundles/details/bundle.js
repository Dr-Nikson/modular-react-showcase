// @flow
import asyncBundle from 'common/routing/asyncBundle'
import type { BundleConfig } from 'common/routing/types'

const name: string = 'details-bundle'
// prettier-ignore
const load: Function = () => new Promise(resolve => setTimeout(resolve, 1500))
  .then(() => import(/* webpackChunkName: "details-bundle" */ 'common/bundles/details/DetailsComponent'))

export const bundle: BundleConfig = {
  name,
  load,
}

export const DetailsBundle = asyncBundle(name)
