// @flow
import asyncBundle from 'react-async-bundles/asyncBundle'
import type { BundleConfig } from 'react-async-bundles/types'

const name: string = 'pupper-bundle'
// prettier-ignore
const load: Function = () => new Promise(resolve => setTimeout(resolve, 1500))
  .then(() => import(/* webpackChunkName: "pupper-bundle" */ 'common/bundles/pupper/entry'))

export const bundle: BundleConfig = {
  name,
  load,
}

export const PupperBundle = asyncBundle(name)
