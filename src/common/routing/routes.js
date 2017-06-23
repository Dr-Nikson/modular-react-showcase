// @flow
import { loadBundle as loadItemBundle } from 'common/bundles/item/index'

const routes = [{ path: '/item', loadBundle: loadItemBundle }]

export default routes
