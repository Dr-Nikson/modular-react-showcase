// @flow
import * as React from 'react'
import type { Element } from 'react'

import asyncBundle from 'common/routing/asyncBundle'
import type { BundleConfig } from 'common/routing/types'

const name: string = 'item-bundle'
// prettier-ignore
const load: Function = () => new Promise(resolve => setTimeout(resolve, 1500))
  .then(() => import(/* webpackChunkName: "item-bundle" */ 'common/bundles/item/entry'))

export const bundle: BundleConfig = {
  name,
  load,
}

export const ItemBundle = asyncBundle(name)
