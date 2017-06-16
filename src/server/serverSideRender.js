// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import App from 'client/App'

import type { $Request, $Response } from 'express'
import Template from './Template'

export const rendererFactory = (template: Template) => {
  return (req: $Request, res: $Response): void => {
    const someElse = ReactDOMServer.renderToString(<App />)
    const output = template.templateString.replace('{{html}}', someElse)

    res.set('Content-Type', 'text/html').send(output)
  }
}
