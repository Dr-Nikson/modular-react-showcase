// @flow
import React from 'react'
import { withRouter } from 'react-router-dom'
import realAsyncBundle from 'react-async-bundles/asyncBundle'
import RealBundleProvider from 'react-async-bundles/BundleProvider'
import withBundles from 'react-async-bundles/withBundles'
import RealDataFetcher from 'refetch/DataFetcher'

import BundleLoading from 'common/routing/components/BundleLoading'
import BundleError from 'common/routing/components/BundleError'

import type { UrlSelector } from 'react-async-bundles/types'

const getUrlFromLocation: UrlSelector = (props: Object): string => {
  const location: Object = props.location
  return location.pathname + location.search + location.hash
}

export const BundleProvider = withRouter(props => (
  <RealBundleProvider urlSelector={getUrlFromLocation} {...props} />
))

export const DataFetcher = withBundles()(RealDataFetcher)

export const asyncBundle = realAsyncBundle(BundleLoading, BundleError)
