// @flow
import React, { PropTypes, PureComponent } from 'react'
import { Route } from 'react-router-dom'
import { Either } from 'ramda-fantasy'
import Try from 'common/utils/Try'

import type { Element } from 'react'
import Status from 'common/routing/components/Status'
import { identity } from 'ramda'

type BundleRouteProps = {
  bundleName: string,
}

type BundleState = {
  component: any | null,
}

type BundleRouteContext = {
  loadBundle: Function, //(string) => Promise<any>,
  getBundleComponent: Function, //(string) => any,
}

const renderBundleComponent = (BundleComponent, props) => (
  <BundleComponent {...props} />
)
const renderBundleLoading = () => <div>loading bundle...</div>

type BundleErrorProps = {
  error: any,
}

const BundleError = (props: BundleErrorProps) => (
  <Status code={500}>
    <div>Bundle loading error: {props.error.toSting()}</div>
  </Status>
)

const withBundle = (bundleName: string) => {
  class Bundle extends PureComponent<void, any, BundleState> {
    state = {
      component: null,
    }

    constructor(props: any, context: BundleRouteContext) {
      super(props, context)
      this.state = {
        component: this.getComponent(),
      }
    }

    getComponent() {
      const { getBundleComponent } = this.context
      return Either.either(
        error => BundleError,
        c => c || null,
        Try(() => getBundleComponent(bundleName))
      )
    }

    componentDidMount() {
      const { component } = this.state
      const { loadBundle } = this.context

      if (!component) {
        loadBundle(bundleName).then(component => this.setState({ component }))
      }
    }

    render() {
      const { component } = this.state

      return component
        ? renderBundleComponent(component, this.props)
        : renderBundleLoading()
    }
  }

  Bundle.contextTypes = {
    loadBundle: PropTypes.func.isRequired,
    getBundleComponent: PropTypes.func.isRequired,
  }

  Bundle.displayName = `Bundle(${bundleName})`

  return Bundle
}

export default withBundle
