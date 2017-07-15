// @flow
import React, { Component, PropTypes } from 'react'
import * as either from 'flow-static-land/lib/Either'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { Either } from 'flow-static-land/lib/Either'
import type {
  BundleContext,
  BundleMeta,
  BundleStore,
  RouteConfig,
  UrlSelector,
} from './types'


type BundleProviderProps = {
  children: any,
  store: BundleStore,
  urlSelector: UrlSelector,
  initializeOnMount: boolean,
}

type BundleProviderChildrenContext = {
  loadBundles: () => Promise<BundleMeta[]>,
  getBundleComponent: (name: string) => Either<*, ?ReactClass<any>>,
  getBundleRoutes: () => RouteConfig[],
  subscribeOnBundles: (cb: Function) => Function,
}


class BundleProvider extends Component<void, BundleProviderProps, void> {
  static childContextTypes: any
  static defaultProps: any
  previousUrl: string = ''

  constructor(props: BundleProviderProps, context: any) {
    super(props, context)
    this.previousUrl = props.initializeOnMount
      ? ''
      : props.urlSelector(props, context)
  }

  loadBundles = (props: BundleProviderProps): Promise<BundleMeta[]> => {
    const { store, urlSelector } = props
    const url = urlSelector(props, this.context)

    this.previousUrl = url
    return store
      .loadForUrl(url)
  }

  getBundleComponent = (bundleName: string): Either<*, ?ReactClass<any>> => {
    const { store } = this.props

    return either.map(
      (context: ?BundleContext): ?ReactClass<any> => {
        // TODO: use maybe here (?)
        return context && context.component
      },
      store.getBundle(bundleName)
    )
  }

  getBundleRoutes = (): RouteConfig[] => {
    return this.props.store.getRoutes()
  }

  subscribeOnBundles = (cb: Function): Function => {
    return this.props.store.subscribe(cb)
  }

  getChildContext(): BundleProviderChildrenContext {
    return {
      loadBundles: () => this.loadBundles(this.props),
      getBundleComponent: this.getBundleComponent,
      getBundleRoutes: this.getBundleRoutes,
      subscribeOnBundles: this.subscribeOnBundles,
    }
  }

  componentDidMount() {
    if (this.props.initializeOnMount) {
      this.loadBundles(this.props)
        .catch(err => {
          console.error('BundleProvider:onMountInitialization failed', err)
        })
    }
  }

  componentWillReceiveProps(nextProps: BundleProviderProps) {
    const nextUrl = nextProps.urlSelector(nextProps, this.context)

    if (this.previousUrl !== nextUrl) {
      this.loadBundles(nextProps)
        .catch(err => {
          console.error('BundleProvider:onUrlChangeLoading failed', err)
        })
    }
  }

  render() {
    const { children } = this.props
    return children
  }
}

BundleProvider.childContextTypes = {
  loadBundles: PropTypes.func.isRequired,
  getBundleComponent: PropTypes.func.isRequired,
  getBundleRoutes: PropTypes.func.isRequired,
  subscribeOnBundles: PropTypes.func.isRequired,
}

BundleProvider.defaultProps = {
  initializeOnMount: false,
}

export default BundleProvider
