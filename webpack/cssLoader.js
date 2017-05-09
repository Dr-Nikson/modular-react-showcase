const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');



module.exports = function(config) {
  const { isProd, nodeEnv, sourcePath } = config

  return isProd
    ? ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            module: true, // css-loader 0.14.5 compatible
            modules: true,
            localIdentName: '[hash:base64:5]',
          },
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'collapsed',
            sourceMap: true,
            includePaths: [sourcePath],
          },
        },
      ],
    })
    : [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          module: true,
          localIdentName: '[path][name]-[local]',
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: false,
          includePaths: [sourcePath],
        },
      },
    ]
}