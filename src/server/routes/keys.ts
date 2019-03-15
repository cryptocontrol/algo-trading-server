import { Router } from 'express'
import * as _ from 'underscore'
import * as Bluebird from 'bluebird'

import { IAppRequest } from 'src/interfaces'
import * as Controllers from '../controllers/keys'

const router = Router()


router.post('/:exchange', (req: IAppRequest, res, next) => {
  Controllers.setAPIKey(req.uid, req.params.exchange, req.body)
    .then(data => res.json(data))
    .catch(next)
})


/**
 * Set the API keys for multiple exchanges for the given user
 */
router.post('/', (req: IAppRequest, res, next) => {
  Bluebird.mapSeries(req.body, (data: any) => Controllers.setAPIKey(req.uid, data.exchange, data.keys))
    .then(data => res.json(data))
    .catch(next)
})


router.get('/', async (req: IAppRequest, res, next) => {
  Controllers.getAllUserApiKeys(req.uid)
    .then(data => res.json(data))
    .catch(next)
})


router.delete('/:exchange', (req: IAppRequest, res, next) => {
  Controllers.deleteApiKey(req.uid, req.params.exchange)
    .then(data => res.json(data))
    .catch(next)
})


export default router
