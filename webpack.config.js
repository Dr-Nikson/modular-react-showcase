const path = require('path')
const webpack = require('webpack')

const baseConfig = {
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/build/public/'),
    // publicPath: '/build/public'
  },
  target: 'node',
  resolve: {
    modules: [
      // path.join(__dirname, '../src/client/scripts'),
      // path.join(__dirname, '../src/client/assets'),
      // path.join(__dirname, '../src/client/assets/javascripts'),
      'node_modules'
    ],
    alias: {
      // models: path.join(__dirname, '../src/client/assets/javascripts/models')
    },
    extensions: ['.js', '.jsx', '.json', '.styl']
  },
  plugins: [
    /*new webpack.ProvidePlugin(
      {
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'  // fetch API
      }
    ),*/
    // Shared code
    /*new webpack.optimize.CommonsChunkPlugin(
      {
        name: 'vendor',
        filename: '[name].bundle.js',
        minChunks: Infinity
      }
    )*/
  ],
  module: {
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                "env",
                {
                  "targets": {
                    "node": "current",
                  },
                  "modules": false,
                  "loose": true
                }
              ]
            ],
            "env": {
              "development": {
                "plugins": [
                  "react-hot-loader/babel"
                ]
              }
            }
          },
        },

      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      /*{
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },*/
      // Fonts
      /*{
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]'
        }
      }*/
    ]
  },
}

module.exports = baseConfig
