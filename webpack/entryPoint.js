
module.exports = function(config) {
  const { isProd } = config
  const entryPoint = [
    'babel-polyfill',

    // activate HMR for React
    !isProd && 'react-hot-loader/patch',

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    !isProd && `webpack-dev-server/client?http://${host}:${port}`,

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    !isProd && 'webpack/hot/only-dev-server',

    // the entry point of our app
    './index.js',
  ]

  return entryPoint.filter(p => !!p)
}