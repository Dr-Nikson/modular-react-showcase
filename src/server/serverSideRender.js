// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { curry, compose, identity } from 'ramda'
import { Either } from 'ramda-fantasy'
import createMemoryHistory from 'history/createMemoryHistory'
import { Provider } from 'react-redux'

import Try from 'common/utils/Try'
import App from 'client/App'
import Template from './Template'
import getRoutes from 'common/routing/getRoutes'
import BundleProvider from 'react-async-bundles/BundleProvider'
import loadBundlesForUrl from 'react-async-bundles/loadBundlesForUrl'
import createStore from 'common/redux/createStore'

import type { $Request, $Response } from 'express'
import type { CurriedFunction2 } from 'ramda'
import type {
  BundleContext,
  BundleUrlLoaderConfig,
  ServerRenderContext,
} from 'react-async-bundles/types'
import { matchPath } from 'react-router-dom'
import bundleStoreCreatorFactory from 'common/routing/bundleStoreCreatorFactory'
import handleReduxModule from 'redux-async-bundles/handleReduxModule'
import extractReducers from 'redux-async-bundles/extractReducers'

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
  const createRenderResult = (
    context: ServerRenderContext,
    html: string,
    initialState: Object = {}
  ): RenderResult => {
    const { url, status, bundles = [] } = context
    const isRedirected = !!url
    const chunkNames = bundles.map(b => b.bundle.name)

    return {
      body: template.renderTemplate({ html, chunkNames, initialState }),
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

    const doServerRender = (initialBundles: BundleContext[]) => {
      const history = createMemoryHistory()
      const initialReducers = extractReducers(initialBundles)
      const store = createStore({ history, initialReducers })
      const createBundleStore = bundleStoreCreatorFactory(store)
      const bundleStore = createBundleStore({ routes }, initialBundles)

      const context: ServerRenderContext = {}
      const serverSideApp = (
        <Provider store={store}>
          <StaticRouter context={context} location={req.url}>
            <BundleProvider store={bundleStore}>
              <App />
            </BundleProvider>
          </StaticRouter>
        </Provider>
      )
      const html = ReactDOMServer.renderToString(serverSideApp)

      return createRenderResult(context, html, store.getState())
    }

    const loaderConfig: BundleUrlLoaderConfig = {
      routes,
      handleBundleModule: handleReduxModule,
      matchPath,
    }

    loadBundlesForUrl(
      loaderConfig,
      req.url
    ).then((bundles: BundleContext[]) => {
      const renderResult: RenderResult = handleRenderErrors(
        Try(() => doServerRender(bundles))
      )

      renderResult.url
        ? sendRedirect(res, renderResult.status, renderResult.url)
        : sendSuccess(res, renderResult.status, renderResult.body)
    })
  }
}
