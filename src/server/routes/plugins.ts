import { Router } from 'express'
import * as _ from 'underscore'

import { IAppRequest } from 'src/interfaces'

const router = Router()


router.post('/:plugin', (req: IAppRequest, res, next) => {
  // register a plugin
  next()
})


router.delete('/:plugin', (req: IAppRequest, res, next) => {
  // de-register a plugin
  next()
})


router.post('/:plugin/:exchange/:symbol', (req: IAppRequest, res, next) => {
  // configure a plugin for a given exchange & symbol
  next()
})


export default router
