// @flow
import express from 'express'

import type { $Request, $Response } from 'express'

const router = express.Router()

router.get('/items', (req: $Request, res: $Response) => {
  res.json([{ id: 1, title: 'Test item' }, { id: 2, title: 'One more test' }])
})

export default router
