// @flow
import React, { PureComponent } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

class TestTo extends PureComponent<void, any, void> {
  componentWillMount() {
    const { redirect } = this.props
    redirect()
  }

  render() {
    return (
      <div>
        <h4>This is test to</h4>
        <div>
          some space for HMR
          <br />
          CANT BELIVE!!! yep, it's done! now children:
          <hr />
          {this.props.children}
          <hr />
        </div>
      </div>
    )
  }
}

export default connect(null, (dispatch: any) => ({
  redirect: () => dispatch(push('/itemzzz')),
}))(TestTo)
