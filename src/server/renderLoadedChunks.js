// @flow
import React from 'react'

const renderLoadedChunks = (names: string[]): string => {
  return (
    names
      .map(
        name =>
          `<script type="text/javascript" src="/static/${name}.js" async></script>`
      )
      // .concat(['</body>'])
      .join('')
  )
}

export default renderLoadedChunks

/*

 var PrintChunksPlugin = function() {};
 PrintChunksPlugin.prototype.apply = function(compiler) {
 compiler.plugin('compilation', function(compilation, params) {
 compilation.plugin('after-optimize-chunk-assets', function(chunks) {
 console.log(chunks.map(function(c) {
 return {
 id: c.id,
 name: c.name,
 includes: c.modules.map(function(m) {
 return m.request;
 })
 };
 }));
 });
 });
 };

*/
