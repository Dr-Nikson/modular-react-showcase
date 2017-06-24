// @flow
import React, { Component, PropTypes } from 'react'
import type { RouteConfig } from 'common/routing/routes'
import type { AsyncBundleConfig, SyncBundleConfig } from 'common/routing/routes'
import { loadAsyncBundle } from 'common/utils/loadAsyncBundles'
import type { BundleContext } from 'common/routing/types'

type BundleLoadingError = {
  bundleName: string,
  error: any,
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
  loadBundle: Function, //string => Promise<any>,
  getBundleComponent: Function, //string => any,
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

  _findRoute = (bundleName: string): ?RouteConfig => {
    const { routes } = this.props
    const route = routes.find((r: any) => r.bundleName)

    return route
  }

  _findBundle = (bundleName: string): ?BundleContext => {
    const { bundles } = this.state
    const bundle = bundles.find(r => r.bundleName)

    return bundle
  }

  _saveLoadedBundle = (bundle: any): Promise<BundleContext> => {
    const finalBundle = (bundle: BundleContext)
    let resolver = null
    const p = new Promise(resolve => (resolver = resolve))

    this.setState(
      {
        bundles: [...this.state.bundles, finalBundle],
      },
      () => resolver && resolver(finalBundle.component)
    )

    return p
  }

  _saveLoadingError = (bundleName: string, error: any): Promise<any> => {
    this.setState({
      errors: [...this.state.errors, { bundleName, error }],
    })

    return Promise.reject(error)
  }

  loadBundle = (bundleName: string): Promise<any> => {
    const targetRoute: AsyncBundleConfig = (this._findRoute(bundleName): any)
    return targetRoute
      ? loadAsyncBundle(targetRoute).then(this._saveLoadedBundle, e =>
          this._saveLoadingError(bundleName, e)
        )
      : Promise.reject(`Config not found for [${bundleName}]`)
  }

  getBundleComponent = (bundleName: string): any => {
    const targetRoute = this._findBundle(bundleName)
    const component =
      targetRoute && ((targetRoute: any): SyncBundleConfig).component
    const error =
      !component && this.state.errors.find(er => er.bundleName === bundleName)

    if (error) {
      throw new Error(error.error)
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
