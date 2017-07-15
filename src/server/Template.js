// @flow

type TemplateData = {
  html: string,
  initialState: Object,
}

class Template {
  _templateString: string = ''

  // $FlowFixMe
  get templateString(): string {
    return this._templateString
  }

  // $FlowFixMe
  set templateString(str: string) {
    this._templateString = str
    return this
  }

  renderTemplate({ html, initialState }: TemplateData): string {
    return this._templateString
      .replace('{{html}}', html)
      .replace('{{initialState}}', JSON.stringify(initialState))
  }
}

export default Template

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
