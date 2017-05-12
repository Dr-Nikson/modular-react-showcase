
// const webpackConfigFileRegEx = /\.\/webpack/
const webpackConfigFileRegEx = /\.\/webpack\.config/

const isConfigPart = request => webpackConfigFileRegEx.test(request)

module.exports = (importType, next) => function excludeWebpackConfig(context, request, callback){
  // console.log('request', isConfigPart(request) ? '+' : '-', request)

  return isConfigPart(request)
    ? callback(null, importType + " " + request)
    : next(context, request, callback)
}
