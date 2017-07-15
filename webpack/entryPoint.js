const path = require('path')

module.exports = function(config) {
  const { isProd, nodeBuild, sourcePath, host, port } = config
  const entryPoint = [
    !nodeBuild && 'babel-polyfill',

    // activate HMR for React
    !isProd && !nodeBuild && 'react-hot-loader/patch',

    !isProd && !nodeBuild && 'webpack-hot-middleware/client',

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    // !isProd && !nodeBuild && `webpack-dev-server/client?http://${host}:${port}`,

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    // !isProd && !nodeBuild && 'webpack/hot/only-dev-server',

    // the entry point of our app
    path.join(sourcePath, `/${nodeBuild ? 'server' : 'client'}/index.js`),
  ]

  return entryPoint.filter(p => !!p)
}