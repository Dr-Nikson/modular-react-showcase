const Webpack = require('webpack')
const config = require('../../webpack.config.js')


const compiler = new Webpack(config())


compiler.plugin('compilation', function(compilation) {
  console.log('started')
  compilation.plugin('html-webpack-plugin-after-emit', function(htmlPluginData, callback) {
    console.log('aaa', htmlPluginData.html.source());
    callback();
  });
});

// compiler.compile((err, compiled) => console.log('null cccc'))
compiler.watch((e, r) => console.log('done'))
