// const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const nodeExternals = require('webpack-node-externals')
const stats = require('./webpack/stats')
const getPlugins = require('./webpack/plugins')
const getEntryPoint = require('./webpack/entryPoint')
const getCssLoader = require('./webpack/cssLoader')

const setBabelTarget = require('./webpack/setBabelTarget')
const excludeWebpackConfig = require('./webpack/excludeWebpackConfig')
const babelRc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'))

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
    projectPath: __dirname,
    sourcePath: path.join(__dirname, `src/`),
    packagesPath: path.join(__dirname, `packages/`),
    buildDirectory: path.join(__dirname, `build/${!!(env && env.node) ? 'private' : 'public'}`),
  }
  const { sourcePath, buildDirectory, projectPath, packagesPath } = config
  const { isProd, nodeBuild, port, host } = config

  return {
    devtool: nodeBuild ? 'source-map' : !isProd && 'cheap-module-source-map',
    context: nodeBuild ?  projectPath : sourcePath,
    target: nodeBuild ? 'node' : 'web',
    externals: [nodeBuild && excludeWebpackConfig('commonjs', nodeExternals())].filter(p => !!p),
    node: {
      __dirname: false,
      __filename: false,
    },
    entry: {
      main: getEntryPoint(config),
    },
    output: {
      path: buildDirectory,
      publicPath: '/static/',
      filename: nodeBuild ? 'index.js' : '[name]-[hash:8].js',
      // chunkFilename: 'chunk-[name]-[chunkhash:8].js',
      chunkFilename: '[name].js',
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
          use: [{
            loader: 'babel-loader',
            options: Object.assign(
              { babelrc: false },
              setBabelTarget(babelRc, nodeBuild ? 'node' : 'browsers')
            ),
          }, 'webpack-module-hot-accept'],
        },
      ],
    },
    resolve: {
      extensions: [
        '.webpack-loader.js',
        '.web-loader.js',
        '.loader.js',
        '.js',
        '.jsx'
      ],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath,
        packagesPath
      ],
    },

    plugins: getPlugins(config),

    performance: isProd && {
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
      hints: 'warning',
    },

    stats: stats,

    devServer: {
      contentBase: sourcePath,
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
