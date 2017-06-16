
class Template {
  _templateString: string = ''

  get templateString(): string {
    return this._templateString
  }

  set templateString(str: string) {
    this._templateString = str
    return this
  }
}

export default Template
