const webpack = require('webpack')
const path = require('path')
const stats = require('./webpack/stats')
const getPlugins = require('./webpack/plugins')
const getEntryPoint = require('./webpack/entryPoint')
const getCssLoader = require('./webpack/cssLoader')


module.exports = function(env) {
  const config = {
    nodeEnv: env && env.prod ? 'production' : 'development',
    isProd: !!(env && env.prod),
    serviceWorkerBuild: env && env.sw,
    // replace localhost with 0.0.0.0 if you want to access
    // your app from wifi or a virtual machine
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    sourcePath: path.join(__dirname, './src/client/'),
    buildDirectory: path.join(__dirname, './build/public'),
  }
  const { sourcePath, buildDirectory, isProd, port, host } = config

  return {
    devtool: isProd && 'cheap-module-source-map',
    context: sourcePath,
    entry: {
      main: getEntryPoint(config),
    },
    output: {
      path: buildDirectory,
      publicPath: '/',
      filename: '[name]-[hash:8].js',
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
          use: ['babel-loader'],
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
