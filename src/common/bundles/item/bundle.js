// @flow
import * as React from 'react'
import { asyncBundle } from 'common/utils/bundle'

import type { Element } from 'react'
import type { BundleConfig } from 'react-async-bundles/types'

const name: string = 'item-bundle'
// prettier-ignore
const load: Function = () => new Promise(resolve => setTimeout(resolve, 1500))
  .then(() => import(/* webpackChunkName: "item-bundle" */ 'common/bundles/item/entry'))

export const bundle: BundleConfig = {
  name,
  load,
}

export const ItemBundle = asyncBundle(name)
