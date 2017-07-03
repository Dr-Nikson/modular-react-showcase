// @flow
import React, { Component, PropTypes } from 'react'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleContext, BundleStore } from './types'


type BundleProviderProps = {
  store: BundleStore,
  children: any,
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
