// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { curry, compose } from 'ramda'
import { Either } from 'ramda-fantasy'

import Try from 'common/utils/Try'
import App from 'client/App'
import Template from './Template'

import type { $Request, $Response } from 'express'
import type { CurriedFunction2 } from 'ramda'

export const rendererFactory = (template: Template) => {
  const renderHtml = html => template.templateString.replace('{{html}}', html)
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

    consumeServerRender(
      Try(() => ReactDOMServer.renderToString(<App />)).bimap(
        getEmptyPageAndLog,
        renderHtml
      )
    )
  }
}
