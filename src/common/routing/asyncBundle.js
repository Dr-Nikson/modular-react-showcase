// @flow
import React, { PropTypes, PureComponent } from 'react'
import { Either } from 'ramda-fantasy'

import Try from 'common/utils/Try'
import BundleError from 'common/routing/components/BundleError'

// $FlowFixMe
import type { ReactClass, Element } from 'react'

type BundleState = {
  component: ReactClass<any> | null,
}

type BundleRouteContext = {
  loadBundle: (name: string) => Promise<ReactClass<any>>,
  getBundleComponent: (name: string) => ReactClass<any>,
}

const renderBundleComponent = (BundleComponent, props) => (
  <BundleComponent {...props} />
)
const renderBundleLoading = () => <div>loading bundle...</div>

const asyncBundle = (bundleName: string) => {
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

    getComponent(): ReactClass<any> {
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

export default asyncBundle
