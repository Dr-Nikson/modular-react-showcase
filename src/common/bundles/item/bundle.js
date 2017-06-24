// @flow
import * as React from 'react'
import Bundle from 'common/routing/components/Bundle'
import { Route } from 'react-router-dom'

import type { Element } from 'react'
import type { ServerRenderContext } from 'common/routing/types'
import { Status } from 'common/routing/components/Status'

import ItemInfo from './ItemInfo'

export const bundleName: string = 'item-bundle'
// export const loadBundle: Function = () => import(/* webpackChunkName: "item-bundle" */ 'common/bundles/item/ItemInfo')
export const loadBundle: Function = () => Promise.resolve(ItemInfo)

const load = (cb: Function) =>
  // new Promise(resolve => setTimeout(resolve, 1000)).then(loadBundle).then(cb)
  loadBundle().then(cb)

export const ClientItemBundle = (props: any) => {
  console.log('ClientItemBundle', 'yep, plz')
  return (
    <div>
      some goood things happens!
    </div>
  )
  /*return (
    <Bundle load={load}>
      {ItemInfo => <ItemInfo {...props} />}
    </Bundle>
  )*/
}

const renderItemBundle = (ItemInfo, props) => <ItemInfo {...props} />

const ServerItemBundle = (props: any) => (
  <Route
    render={(routerContext: any): Element<any> => {
      const {
        bundles = [],
      } = (routerContext.staticContext: ServerRenderContext)
      const itemBundle = bundles.find(
        bundle => bundle.loadBundle === loadBundle
      )

      return !!itemBundle
        ? renderItemBundle(itemBundle.component, props)
        : <Status code={500}><div>Bundle loading error</div></Status>
    }}
  />
)

// $FlowFixMe
// export const ItemBundle = __CLIENT__ ? ClientItemBundle : ServerItemBundle
export const ItemBundle = ClientItemBundle
