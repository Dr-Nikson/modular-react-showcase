// @flow
import React, { PropTypes, PureComponent } from 'react'
import * as either from 'flow-static-land/lib/Either'
import BundleError from 'common/routing/components/BundleError'

// $FlowFixMe
import type { ReactClass, Element } from 'react'


type BundleState = {
  component: ReactClass<any> | null,
}

type BundleRouteContext = {
  // TODO fix types: it return either now
  getBundleComponent: (name: string) => any,
  subscribeOnBundles: (cb: Function) => Function,
}

const renderBundleComponent = (BundleComponent, props) => (
  <BundleComponent {...props} />
)
const renderBundleLoading = () => <div>loading bundle...</div>

const asyncBundle = (bundleName: string) => {
  class Bundle extends PureComponent<void, any, BundleState> {
    unsubscribe: ?Function = null
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

      return either.either(
        error => BundleError,
        c => c || null,
        getBundleComponent(bundleName)
      )
    }

    componentDidMount() {
      const { subscribeOnBundles } = this.context

      this.unsubscribe = subscribeOnBundles(() => {
        this.setState({
          component: this.getComponent()
        })
      })
    }

    componentWillUnmount() {
      this.unsubscribe && this.unsubscribe()
    }

    render() {
      const { component } = this.state

      return component
        ? renderBundleComponent(component, this.props)
        : renderBundleLoading()
    }
  }

  Bundle.contextTypes = {
    getBundleComponent: PropTypes.func.isRequired,
    subscribeOnBundles: PropTypes.func.isRequired,
  }

  Bundle.displayName = `Bundle(${bundleName})`

  return Bundle
}

export default asyncBundle
