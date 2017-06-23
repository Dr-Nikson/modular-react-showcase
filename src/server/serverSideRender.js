// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { compose, identity } from 'ramda'
import { Either } from 'ramda-fantasy'

import Try from 'common/utils/Try'
import App from 'client/App'
import Template from './Template'
import routes from 'common/routing/routes'

import type { $Request, $Response } from 'express'
import type { CurriedFunction2 } from 'ramda'
import type { ServerRenderContext } from '../common/routing/types'
import type { BundleContext } from 'common/routing/types'

type RenderResult = {
  status: number,
  body: string,
  url?: string,
}

const sendSuccess = (res: $Response, status: number, body: string): $Response =>
  res.status(status).set('Content-Type', 'text/html').send(body)
const sendRedirect = (res: $Response, status: number, url: string): $Response =>
  res.redirect(status, url)

const loadAsyncComponents = (routes, url): Promise<BundleContext[]> => {
  const matched = Promise.all(
    routes.filter(route => matchPath(url, route)).map(route =>
      route.loadBundle().then(component => ({
        ...route,
        component: component.default ? component.default : component,
      }))
    )
  )

  return matched
}

export const rendererFactory = (template: Template) => {
  const renderTemplate = (html: string) =>
    template.templateString.replace('{{html}}', html)
  const createRenderResult = (
    context: ServerRenderContext,
    html: string
  ): RenderResult => {
    const { url, status } = context
    const isRedirected = !!url

    return {
      body: renderTemplate(html),
      status: status || (isRedirected ? 301 : 200),
      url,
    }
  }
  const getEmptyPageAndLog = compose(
    () => createRenderResult({ status: 500 }, ''),
    e => console.error('[SERVER] Render error', e)
  )

  return (req: $Request, res: $Response): void => {
    const handleRenderErrors = Either.either(getEmptyPageAndLog, identity)
    const doServerRender = (bundles: BundleContext[]) => {
      const context: ServerRenderContext = { bundles }
      const serverSideApp = (
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      )
      const html = ReactDOMServer.renderToString(serverSideApp)

      return createRenderResult(context, html)
    }

    loadAsyncComponents(routes, req.url).then(bundles => {
      const renderResult: RenderResult = handleRenderErrors(
        Try(() => doServerRender((bundles: BundleContext[])))
      )

      renderResult.url
        ? sendRedirect(res, renderResult.status, renderResult.url)
        : sendSuccess(res, renderResult.status, renderResult.body)
    })
  }
}
