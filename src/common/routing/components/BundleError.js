// @flow
import React from 'react'
import Status from 'common/routing/components/Status'

type BundleErrorProps = {
  error?: Object,
}

const BundleError = ({ error }: BundleErrorProps) => (
  <Status code={500}>
    <div>
      Bundle loading error: {error ? error.toSting() : '[no error descripion]'}
    </div>
  </Status>
)

export default BundleError
