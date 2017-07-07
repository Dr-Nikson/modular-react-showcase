// @flow
import { default as _asyncBundle } from 'react-async-bundles/asyncBundle'
import type { UrlSelector } from 'react-async-bundles/types'

const getUrlFromLocation: UrlSelector = (props: Object): string => {
  const location: Object = props.location
  return location.pathname + location.search + location.hash
}

export const asyncBundle = (bundleName: string) =>
  _asyncBundle(bundleName, getUrlFromLocation)
