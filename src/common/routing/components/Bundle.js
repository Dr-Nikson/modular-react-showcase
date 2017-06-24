// @flow
import React, { Component } from 'react'
import type { Element } from 'react'

type BundleProps = {
  load: (cb: Function) => any,
  children: Function,
}

type BundleState = {
  mod: any,
}

class Bundle extends Component<void, BundleProps, BundleState> {
  // static props: BundleProps
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: null,
  }

  componentWillMount() {
    this.load(this.props)
  }

  shouldComponentUpdate(nextProps: BundleProps, nextState: BundleState) {
    return true
  }

  componentWillReceiveProps(nextProps: BundleProps) {
    if (nextProps.load !== this.props.load || true) {
      this.load(nextProps)
    }
  }

  load(props: BundleProps) {
    this.setState({
      mod: null,
    })
    props.load(mod => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod,
      })
    })
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}

export default Bundle
