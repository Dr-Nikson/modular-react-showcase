// @flow
import React from 'react'

import Status from './Status'

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>404</h1>
      <h2>
        This is not the page that you're looking for!
      </h2>
    </div>
  </Status>
)

export default NotFound
