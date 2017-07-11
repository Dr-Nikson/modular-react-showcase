// @flow
import React from 'react'
// import { default as _asyncBundle } from 'react-async-bundles/asyncBundle'
import { withRouter } from 'react-router-dom'
import RealBundleProvider from 'react-async-bundles/BundleProvider'
import withBundles from 'react-async-bundles/withBundles'
import RealDataFetcher from 'refetch/DataFetcher'

import type { UrlSelector } from 'react-async-bundles/types'

const getUrlFromLocation: UrlSelector = (props: Object): string => {
  const location: Object = props.location
  return location.pathname + location.search + location.hash
}

export const BundleProvider = withRouter(props => (
  <RealBundleProvider urlSelector={getUrlFromLocation} {...props} />
))

export const DataFetcher = withBundles()(RealDataFetcher)
