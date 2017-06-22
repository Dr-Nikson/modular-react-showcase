// @flow
import 'source-map-support/register'

import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import type { $Application } from 'express'
import { rendererFactory } from './serverSideRender'
import Template from './Template'

const app: $Application = express()
const template: Template = new Template()

//noinspection JSUnresolvedVariable
// $FlowFixMe
if (__DEVELOPMENT__) {
  const webpack = require('webpack')
  const webpackConfig = require('../../webpack.config')(process.env)
  const compiler = webpack(webpackConfig)

  compiler.plugin('compilation', compilation =>
    compilation.plugin(
      'html-webpack-plugin-after-emit',
      (htmlPluginData, callback) => {
        console.log('[SERVER] Template updated')
        template.templateString = htmlPluginData.html.source()
        callback()
      }
    )
  )

  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    })
  )
  app.use(webpackHotMiddleware(compiler))
}

//noinspection JSUnresolvedVariable
// $FlowFixMe
if (__PRODUCTION__) {
  template.templateString = fs.readFileSync(
    path.join(__dirname, './../public/index.html'),
    'utf8'
  )
}

app.use('/static/', express.static(path.join(__dirname, './../public')))
app.get('/*', rendererFactory(template))

console.log('App is ok!!')

const port: number = +process.env.APP_PORT || 3002
const server = app.listen(port, function() {
  console.log('Example app listening at http://::%s', port)
})
