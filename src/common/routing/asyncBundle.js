// @flow
import React, { PropTypes, PureComponent } from 'react'
import { Either } from 'ramda-fantasy'

import Try from 'common/utils/Try'
import BundleError from 'common/routing/components/BundleError'

// $FlowFixMe
import type { ReactClass, Element } from 'react'
import type { BundleContext } from 'common/routing/types'

type BundleState = {
  component: ReactClass<any> | null,
}

type BundleRouteContext = {
  loadBundleComponent: (name: string) => Promise<ReactClass<any>>,
  // TODO fix types: it return either now
  getBundleComponent: (name: string) => any,
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
        getBundleComponent(bundleName)
      )
    }

    componentDidMount() {
      const { component } = this.state
      const { loadBundleComponent } = this.context

      if (!component) {
        loadBundleComponent(bundleName).then(
          component => this.setState({ component }),
          error => this.setState({ component: BundleError })
        )
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
    loadBundleComponent: PropTypes.func.isRequired,
    getBundleComponent: PropTypes.func.isRequired,
  }

  Bundle.displayName = `Bundle(${bundleName})`

  return Bundle
}

export default asyncBundle
