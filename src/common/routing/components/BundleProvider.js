// @flow
import React, { Component, PropTypes } from 'react'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleContext } from 'common/routing/types'
import type { BundleStore } from 'common/routing/createBundleStore'

type BundleLoadingError = {
  bundleName: string,
  details: any,
}

type BundleProviderProps = {
  // loadBundle?: (config: AsyncRouteConfig) => Promise<BundleContext>,
  // bundles: BundleContext[],
  // routes: RouteConfig[],
  store: BundleStore,
  children: any,
}

type BundleProviderState = {
  bundles: BundleContext[],
  errors: BundleLoadingError[],
}

type BundleProviderChildrenContext = {
  loadBundleComponent: (name: string) => Promise<ReactClass<any>>,
  getBundleComponent: (name: string) => ReactClass<any>,
}

class BundleProvider extends Component<void, BundleProviderProps, void> {
  static childContextTypes: any

  loadBundleComponent = (bundleName: string): Promise<ReactClass<any>> => {
    const { store } = this.props

    return store
      .load(bundleName)
      .then((context: BundleContext) => context.component)
  }

  getBundleComponent = (bundleName: string): any => {
    const { store } = this.props

    return store
      .getBundle(bundleName)
      .map((context: ?BundleContext): ?ReactClass<any> => {
        return context && context.component
      })
  }

  getChildContext(): BundleProviderChildrenContext {
    return {
      loadBundleComponent: this.loadBundleComponent,
      getBundleComponent: this.getBundleComponent,
    }
  }

  render() {
    const { children } = this.props
    return children
  }
}

BundleProvider.childContextTypes = {
  loadBundleComponent: PropTypes.func.isRequired,
  getBundleComponent: PropTypes.func.isRequired,
}

export default BundleProvider
