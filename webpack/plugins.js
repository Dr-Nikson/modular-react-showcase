const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

console.log('filename', __filename)

module.exports = function(config) {
  const { isProd, nodeEnv, nodeBuild, serviceWorkerBuild, sourcePath } = config
  // const nodeEnv = env && env.prod ? 'production' : 'development';
  // const isProd = nodeEnv === 'production';
  // const serviceWorkerBuild = env && env.sw;
  console.log('template path', sourcePath, path.join(sourcePath, '/client/template.ejs'))

  const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      minChunks: 2,
    }),

    // setting production environment will strip out
    // some of the development code from the app
    // and libraries
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },

      __PRODUCTION__: isProd,
      __DEVELOPMENT__: !isProd,
      __CLIENT__: !nodeBuild,
      __SERVER__: nodeBuild,
    }),

    // create css bundle
    new ExtractTextPlugin('style-[contenthash:8].css'),

    // create index.html
    !nodeBuild && new HtmlWebpackPlugin({
      template: path.join(sourcePath, '/client/template.ejs'),
      inject: true,
      production: isProd,
      minify: isProd && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    // make sure script tags are async to avoid blocking html render
    !nodeBuild && new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
      preload: /\.js$/,
      // preload: /^chunk-/,
    }),

    // preload chunks
    !nodeBuild && new PreloadWebpackPlugin(),

    // minify remove some of the dead code
    isProd && new UglifyJSPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    }),

    // make hot reloading work
    !isProd && !nodeBuild && new webpack.HotModuleReplacementPlugin(),

    // show module names instead of numbers in webpack stats
    !isProd && new webpack.NamedModulesPlugin(),

    // don't spit out any errors in compiled assets
    !isProd && new webpack.NoEmitOnErrorsPlugin(),

    serviceWorkerBuild && new SWPrecacheWebpackPlugin({
      cacheId: 'budgeting-app',
      filename: 'sw.js',
      maximumFileSizeToCacheInBytes: 800000,
      mergeStaticsConfig: true,
      minify: true,
      runtimeCaching: [
        {
          handler: 'cacheFirst',
          urlPattern: /(.*?)/,
        },
      ],
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: isProd && !nodeBuild,
    }),
  ].filter(p => !!p)

  return plugins
}