// @flow
import React from 'react'

export const TestTo = (props: any) => (
  <div>
    <h4>This is test to</h4>
    <p>
      some space for HMR
      <br />
      CANT BELIVE!!! yep, it's done! now children:
      <hr />
      {props.children}
      <hr />
    </p>
  </div>
)

export default TestTo
