const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = require('./webpack.config')


const globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true'))
}
// https://github.com/nicksp/redux-webpack-es6-boilerplate/blob/master/config/webpack.config.production.js
module.exports = merge(config, {
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      // 'webpack-hot-middleware/client',
      // 'react-hot-loader/patch',
      path.join(__dirname, '/src/client/index.js'),
    ],
    // vendor: ['react', 'react-dom']
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(globals),
  ],
})
