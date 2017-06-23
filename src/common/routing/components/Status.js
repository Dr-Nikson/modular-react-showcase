// @flow
import React from 'react'
import { Route } from 'react-router-dom'

import type { Element } from 'react'
import type { ServerRenderContext } from '../types'

type StatusProps = {
  code: number,
  children: Element<*>,
}

export const Status = ({ code, children }: StatusProps) => (
  <Route
    render={(routerContext: any): Element<*> => {
      if (routerContext.staticContext)
        (routerContext.staticContext: ServerRenderContext).status = code
      return children
    }}
  />
)

export default Status
