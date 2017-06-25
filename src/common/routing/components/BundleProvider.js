// @flow
import React, { Component, PropTypes } from 'react'
import { loadAsyncBundle } from 'common/routing/bundleLoadingUtils'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { RouteConfig, BundleContext } from 'common/routing/types'
import type { AsyncRouteConfig } from 'common/routing/types'

type BundleLoadingError = {
  bundleName: string,
  details: any,
}

type BundleProviderProps = {
  bundles: BundleContext[],
  routes: RouteConfig[],
  children: any,
}

type BundleProviderState = {
  bundles: BundleContext[],
  errors: BundleLoadingError[],
}

type BundleProviderChildrenContext = {
  loadBundle: (name: string) => Promise<ReactClass<any>>,
  getBundleComponent: (name: string) => ReactClass<any>,
}

class BundleProvider
  extends Component<void, BundleProviderProps, BundleProviderState> {
  static childContextTypes: any
  state = {
    bundles: [],
    errors: [],
  }

  constructor(props: BundleProviderProps, context: any) {
    super(props, context)
    this.state = {
      bundles: props.bundles,
      errors: [],
    }
  }

  _findAsyncRoute = (name: string): ?AsyncRouteConfig => {
    const { routes } = this.props
    const route = routes
      .filter((r: any) => !!r.bundle)
      .map((r: any) => (r: AsyncRouteConfig))
      .find(r => r.bundle.name === name)

    return route
  }

  _findBundle = (name: string): ?BundleContext => {
    const { bundles } = this.state
    const bundle = bundles.find(r => r.bundle.name === name)

    return bundle
  }

  _saveLoadedBundle = (bundle: BundleContext): Promise<BundleContext> => {
    let resolver = null
    const p = new Promise(resolve => (resolver = resolve))

    this.setState(
      { bundles: [...this.state.bundles, bundle] },
      () => resolver && resolver(bundle.component)
    )

    return p
  }

  _saveLoadingError = (bundleName: string, details: any): Promise<any> => {
    this.setState({
      errors: [...this.state.errors, { bundleName, details }],
    })

    return Promise.reject(details)
  }

  loadBundle = (bundleName: string): Promise<any> => {
    const targetRoute: ?AsyncRouteConfig = this._findAsyncRoute(bundleName)
    return targetRoute
      ? loadAsyncBundle(targetRoute).then(this._saveLoadedBundle, e =>
          this._saveLoadingError(bundleName, e)
        )
      : Promise.reject(`Config not found for [${bundleName}]`)
  }

  getBundleComponent = (bundleName: string): any => {
    const targetBundle: ?BundleContext = this._findBundle(bundleName)
    const component = targetBundle && targetBundle.component
    const error =
      !component && this.state.errors.find(er => er.bundleName === bundleName)

    if (error) {
      throw new Error(error.details)
    }

    return component
  }

  getChildContext(): BundleProviderChildrenContext {
    return {
      loadBundle: this.loadBundle,
      getBundleComponent: this.getBundleComponent,
    }
  }

  render() {
    const { children } = this.props
    return children
  }
}

BundleProvider.childContextTypes = {
  loadBundle: PropTypes.func.isRequired,
  getBundleComponent: PropTypes.func.isRequired,
}

export default BundleProvider
