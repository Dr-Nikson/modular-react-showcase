// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { curry, compose } from 'ramda'
import { Either } from 'ramda-fantasy'

import Try from 'common/utils/Try'
import App from 'client/App'
import Template from './Template'

import type { $Request, $Response } from 'express'
import type { CurriedFunction2 } from 'ramda'

export const rendererFactory = (template: Template) => {
  const renderHtml = (html: string) =>
    template.templateString.replace('{{html}}', html)
  const getEmptyPageAndLog = compose(
    () => renderHtml(''),
    e => console.error('[SERVER] Render error', e)
  )
  const sendResponse: Function = (
    res: $Response,
    status: number,
    body: string
  ): $Response => res.status(status).set('Content-Type', 'text/html').send(body)

  return (req: $Request, res: $Response): void => {
    const send: CurriedFunction2<number, string, $Response> = curry(
      sendResponse
    )(res)
    const consumeServerRender = Either.either(send(500), send(200))
    const context = {}
    const serverSideApp = (
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    )
    consumeServerRender(
      Try(() => ReactDOMServer.renderToString(serverSideApp)).bimap(
        getEmptyPageAndLog,
        renderHtml
      )
    )
  }
}
