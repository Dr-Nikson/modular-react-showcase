// @flow
import React, { PureComponent } from 'react'

class UsedTwice extends PureComponent<void, any, void> {
  render() {
    return (
      <div>
        <h4>UsedTwice component</h4>
        Start
        <hr />
        <hr />
        {this.props.children}
        <hr />
        <hr />
        End
      </div>
    )
  }
}

export default UsedTwice
