// @flow
import React, { PropTypes, PureComponent } from 'react'
import { Either } from 'ramda-fantasy'

import BundleError from 'common/routing/components/BundleError'

// $FlowFixMe
import type { ReactClass, Element } from 'react'
import type { UrlSelector } from './types'

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

const asyncBundle = (bundleName: string, urlSelector: UrlSelector) => {
  class Bundle extends PureComponent<void, any, BundleState> {
    mounted: boolean = false
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
      const { loadBundles } = this.context

      this.mounted = true

      if (!component) {
        loadBundles(urlSelector(this.props, this.context)).then(
          () => this.mounted && this.setState({
            component: this.getComponent()
          }),
          error => this.mounted && this.setState({ component: BundleError })
        )
      }
    }

    componentWillUnmount() {
      this.mounted = false
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
    loadBundles: PropTypes.func.isRequired,
    getBundleComponent: PropTypes.func.isRequired,
  }

  Bundle.displayName = `Bundle(${bundleName})`

  return Bundle
}

export default asyncBundle
