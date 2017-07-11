// @flow
import React, { Component, PropTypes } from 'react'

// $FlowFixMe
import type { ReactClass } from 'react'
import type { BundleContext, BundleStore, UrlSelector } from './types'


type BundleProviderProps = {
  children: any,
  store: BundleStore,
  urlSelector: UrlSelector,
  initializeOnMount: boolean,
}

type BundleProviderChildrenContext = {
  loadBundles: () => Promise<BundleContext[]>,
  getBundleComponent: (name: string) => ReactClass<any>,
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

  loadBundles = (props: BundleProviderProps): Promise<BundleContext[]> => {
    const { store, urlSelector } = props
    const url = urlSelector(props, this.context)

    return store
      .loadForUrl(url)
      .then(r => {
        this.previousUrl = url
        return r
      })
  }

  getBundleComponent = (bundleName: string): any => {
    const { store } = this.props

    return store
      .getBundle(bundleName)
      .map((context: ?BundleContext): ?ReactClass<any> => {
        return context && context.component
      })
  }

  subscribeOnBundles = (cb: Function): Function => {
    return this.props.store.subscribe(cb)
  }

  getChildContext(): BundleProviderChildrenContext {
    return {
      loadBundles: () => this.loadBundles(this.props),
      getBundleComponent: this.getBundleComponent,
      subscribeOnBundles: this.subscribeOnBundles,
    }
  }

  componentDidMount() {
    if (this.props.initializeOnMount) {
      this.loadBundles(this.props).catch(err => {
        console.error('BundleProvider:onMountInitialization failed', err)
      })
    }
  }

  componentWillReceiveProps(nextProps: BundleProviderProps) {
    const nextUrl = nextProps.urlSelector(nextProps, this.context)

    if (this.previousUrl !== nextUrl) {
      this.loadBundles(nextProps).catch(err => {
        console.error('BundleProvider:onUrlChangeLoading failed', err)
      })
    }
  }

  componentWillUnmount() {
    // this.mounted = false
  }

  render() {
    const { children } = this.props
    return children
  }
}

BundleProvider.childContextTypes = {
  loadBundles: PropTypes.func.isRequired,
  getBundleComponent: PropTypes.func.isRequired,
  subscribeOnBundles: PropTypes.func.isRequired,
}

BundleProvider.defaultProps = {
  initializeOnMount: false,
}

export default BundleProvider
