// @flow
import urlUtils from 'url'

import type { Location } from 'react-router-dom'

export const createLocationFromUrl = (url: string): Location => {
  const {
    pathname,
    search,
    hash,
    ...rest,
  } = urlUtils.parse(url)

  return {
    pathname: pathname || '',
    search: search || '',
    hash: hash || '',
    ...rest,
  }
}

export const getUrlFromLocation = (location: Location): string  => {
  return location.pathname + location.search + location.hash
}
