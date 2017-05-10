const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const nodeExternals = require('webpack-node-externals')
const stats = require('./webpack/stats')
const getPlugins = require('./webpack/plugins')
const getEntryPoint = require('./webpack/entryPoint')
const getCssLoader = require('./webpack/cssLoader')

const setBabelTarget = require('./webpack/setBabelTarget')
const babelRc = JSON.parse(fs.readFileSync(path.join(__dirname, './.babelrc'), 'utf8'))

module.exports = function(env) {
  const config = {
    nodeEnv: env && env.prod ? 'production' : 'development',
    isProd: !!(env && env.prod),
    serviceWorkerBuild: !!(env && env.sw),
    nodeBuild: !!(env && env.node),
    // replace localhost with 0.0.0.0 if you want to access
    // your app from wifi or a virtual machine
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    sourcePath: path.join(__dirname, `./src/`),
    buildDirectory: path.join(__dirname, `./build/${!!(env && env.node) ? 'private' : 'public'}`),
  }
  const { sourcePath, buildDirectory, isProd, nodeBuild, port, host } = config

  return {
    devtool: nodeBuild ? 'source-map' : !isProd && 'cheap-module-source-map',
    context: sourcePath,
    target: nodeBuild ? 'node' : 'web',
    externals: [nodeExternals()],
    entry: {
      main: getEntryPoint(config),
    },
    output: {
      path: buildDirectory,
      publicPath: '/',
      filename: nodeBuild ? 'index.js' : '[name]-[hash:8].js',
      chunkFilename: 'chunk-[name]-[chunkhash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.(html|svg|jpe?g|png|ttf|woff2?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/[name]-[hash:8].[ext]',
            },
          },
        },
        /*{
          test: /\.scss$/,
          exclude: /node_modules/,
          use: getCssLoader(config),
        },*/
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: Object.assign(
              { babelrc: false },
              setBabelTarget(babelRc, nodeBuild ? 'node' : 'browsers')
            ),
          },
        },
      ],
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [path.resolve(__dirname, 'node_modules'), sourcePath],
    },

    plugins: getPlugins(config),

    performance: isProd && {
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
      hints: 'warning',
    },

    stats: stats,

    devServer: {
      contentBase: './src/client/',
      publicPath: '/',
      historyApiFallback: true,
      port: port,
      host: host,
      hot: !isProd,
      compress: isProd,
      stats: stats,
    },
  }
}
