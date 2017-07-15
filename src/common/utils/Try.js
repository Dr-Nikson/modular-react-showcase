// @flow

import { Either } from 'ramda-fantasy'

function Try(fn) {
  try {
    return Either.Right(fn())
  } catch (e) {
    return Either.Left(e)
  }
}

export default Try
