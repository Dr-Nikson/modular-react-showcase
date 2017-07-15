// @flow
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import * as either from 'flow-static-land/lib/Either'

// $FlowFixMe
import type { ReactClass, Element } from 'react'


type BundleState = {
  component: ReactClass<any>,
}

type BundleRouteContext = {
  // TODO fix types: it return either now
  getBundleComponent: (name: string) => any,
  subscribeOnBundles: (cb: Function) => Function,
}

const DefaultLoadingComponent = () => <div>loading bundle...</div>
const DefaultErrorComponent = (props: Object) => (
  <div>
    Bundle loading failed:&nbsp;
    {props.error ? props.error.toString() : 'unknown error' }
  </div>
)

const asyncBundle = (
  LoadingComponent: ReactClass<any> = DefaultLoadingComponent,
  ErrorComponent: ReactClass<any> = DefaultErrorComponent,
) => (bundleName: string): ReactClass<any> => {
  const errorComponentFactory = (error: any) => (props: Object) => (
    <ErrorComponent {...props} error={error} />
  )

  class Bundle extends PureComponent<void, any, BundleState> {
    unsubscribe: ?Function = null
    state: BundleState

    constructor(props: any, context: BundleRouteContext) {
      super(props, context)
      this.state = {
        component: this.getComponent(),
      }
    }

    getComponent(): ReactClass<any> {
      const { getBundleComponent } = this.context

      return either.either(
        errorComponentFactory,
        c => c || LoadingComponent,
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
      const { component: FinalComponent } = this.state

      return <FinalComponent {...this.props} />
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
