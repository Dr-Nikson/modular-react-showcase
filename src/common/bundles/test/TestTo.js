// @flow
import React from 'react'

export const TestTo = (props: any) => (
  <div>
    <h4>This is test to</h4>
    <div>
      some space for HMR
      <br />
      CANT BELIVE!!! yep, it's done! now children:
      <hr />
      {props.children}
      <hr />
    </div>
  </div>
)

export default TestTo
