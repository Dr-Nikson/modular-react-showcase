// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// $FlowFixMe
import { compose, join, over, toUpper, lensIndex } from 'ramda'

// $FlowFixMe
import type { ReactClass } from 'react'

type WithBundlesState = {
  providedProps: { [string]: any }
}


const toTitle = compose(
  join(''),
  over(lensIndex(0), toUpper)
)


const withBundles = (propertyNamespace: string = '') => {
  return (WrappedComponent: ReactClass<*>): ReactClass<*> => {

    const getPropertyName = (name: string) => (
      propertyNamespace
      + `${propertyNamespace.length > 0 ? toTitle(name) : name}`
    )

    class WithBundles extends Component<void, void, WithBundlesState> {
      unsubscribe: ?Function = null
      mounted: boolean = false
      state: WithBundlesState = {
        providedProps: {}
      }

      componentDidMount() {
        const { getBundleRoutes, subscribeOnBundles } = this.context

        this.mounted = true
        this.unsubscribe = subscribeOnBundles(() => {
          return this.mounted && this.setState({
            providedProps: {
              [getPropertyName('routes')]: getBundleRoutes()
            }
          })
        })
      }

      componentWillUnmount() {
        this.mounted = false
        this.unsubscribe && this.unsubscribe()
      }

      render() {
        return <WrappedComponent
          {...this.props}
          {...this.state.providedProps}
        />
      }
    }

    WithBundles.contextTypes = {
      getBundleRoutes: PropTypes.func.isRequired,
      subscribeOnBundles: PropTypes.func.isRequired,
    }

    WithBundles.displayName =
      `WithBundles(${WrappedComponent.displayName || ''})`

    return WithBundles
  }
}

export default withBundles
