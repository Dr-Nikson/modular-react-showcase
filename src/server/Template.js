// @flow

type TemplateData = {
  html: string,
  chunkNames: string[],
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

  renderTemplate({ html, initialState, chunkNames }: TemplateData): string {
    return this._templateString
      .replace('{{html}}', html)
      .replace('{{initialState}}', JSON.stringify(initialState))
      .replace('</body>', this._renderChunks(chunkNames) + '</body>')
  }

  _renderChunks(names: string[]): string {
    return names
      .map(
        name =>
          `<script type="text/javascript" src="/static/${name}.js" async></script>`
      )
      .join('')
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
