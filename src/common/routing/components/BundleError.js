// @flow
import React from 'react'
import Status from 'common/routing/components/Status'

type BundleErrorProps = {
  error: Object,
}

const BundleError = (props: BundleErrorProps) => (
  <Status code={500}>
    <div>Bundle loading error: {props.error.toSting()}</div>
  </Status>
)

export default BundleError
