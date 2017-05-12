import 'source-map-support/register'
import React from 'react'
import express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'


const app = express()

//noinspection JSUnresolvedVariable
if (__DEVELOPMENT__) {
  const webpack = require('webpack')
  const webpackConfig = require('../../webpack.config')(process.env)
  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}

app.use('/static/', express.static(__dirname + '/../../public'))

app.get('/*', (req,res) => {
  res.send('Hello, AHHDHSHASHSH')
})

console.log('App is ok!')

const port = process.env.APP_PORT || 3002
const server = app.listen(port, function () {
  console.log('Example app listening at http://::%s', port)
})
