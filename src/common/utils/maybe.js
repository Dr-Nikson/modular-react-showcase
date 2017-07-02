// @flow
import * as maybe from 'flow-static-land/lib/Maybe'
import type { Maybe } from 'flow-static-land/lib/Maybe'

export * from 'flow-static-land/lib/Maybe'

export function getOrElse<A>(fa: Maybe<A>, f: () => A): A {
  const a = maybe.prj(fa)
  return a == null ? f() : a
}
