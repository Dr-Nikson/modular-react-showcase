// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { compose, identity } from 'ramda'
import { Either } from 'ramda-fantasy'

import Try from 'common/utils/Try'
import App from 'client/App'
import Template from './Template'
import getRoutes from 'common/routing/getRoutes'
import renderLoadedChunks from 'server/renderLoadedChunks'
import { loadAsyncBundles } from 'common/routing/bundleLoadingUtils'

import type { $Request, $Response } from 'express'
import type { CurriedFunction2 } from 'ramda'
import type { ServerRenderContext } from '../common/routing/types'
import type { BundleContext } from 'common/routing/types'
import BundleProvider from 'common/routing/components/BundleProvider'

type RenderResult = {
  status: number,
  body: string,
  url?: string,
}

const sendSuccess = (res: $Response, status: number, body: string): $Response =>
  res.status(status).set('Content-Type', 'text/html').send(body)
const sendRedirect = (res: $Response, status: number, url: string): $Response =>
  res.redirect(status, url)

export const rendererFactory = (template: Template) => {
  const renderTemplate = (html: string, chunkNames: string[]) =>
    template.templateString
      .replace('{{html}}', html)
      .replace('</body>', renderLoadedChunks(chunkNames))
      .replace('{{bundles}}', JSON.stringify(chunkNames))
  const createRenderResult = (
    context: ServerRenderContext,
    html: string
  ): RenderResult => {
    const { url, status, bundles = [] } = context
    const isRedirected = !!url
    const chunkNames = bundles.map(b => b.bundle.name)

    return {
      body: renderTemplate(html, chunkNames),
      status: status || (isRedirected ? 301 : 200),
      url,
    }
  }
  const getEmptyPageAndLog = compose(
    () => createRenderResult({ status: 500 }, ''),
    e => console.error('[SERVER] Render error', e)
  )

  return (req: $Request, res: $Response): void => {
    const routes = getRoutes()
    const handleRenderErrors = Either.either(getEmptyPageAndLog, identity)
    const doServerRender = (bundles: BundleContext[]) => {
      const context: ServerRenderContext = { bundles }
      const serverSideApp = (
        <StaticRouter context={context} location={req.url}>
          <BundleProvider bundles={bundles} routes={routes}>
            <App />
          </BundleProvider>
        </StaticRouter>
      )
      const html = ReactDOMServer.renderToString(serverSideApp)

      return createRenderResult(context, html)
    }

    loadAsyncBundles(routes, req.url).then(bundles => {
      const renderResult: RenderResult = handleRenderErrors(
        Try(() => doServerRender((bundles: BundleContext[])))
      )

      renderResult.url
        ? sendRedirect(res, renderResult.status, renderResult.url)
        : sendSuccess(res, renderResult.status, renderResult.body)
    })
  }
}
