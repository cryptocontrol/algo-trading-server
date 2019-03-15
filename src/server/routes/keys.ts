import { Router } from 'express'
import * as _ from 'underscore'
import * as Bluebird from 'bluebird'

import { IAppRequest } from 'src/interfaces'
import * as Controllers from '../controllers/keys'

const router = Router()


// add an api key for an exchange
router.post('/:exchange', (req: IAppRequest, res, next) => {
  Controllers.setAPIKey(req.uid, req.params.exchange, req.body)
    .then(data => res.json(data))
    .catch(next)
})


// add api keys for multiple exchanges
router.post('/', (req: IAppRequest, res, next) => {
  Bluebird.mapSeries(req.body, (data: any) => Controllers.setAPIKey(req.uid, data.exchange, data.keys))
    .then(data => res.json(data))
    .catch(next)
})


// get all user's api keys
router.get('/', async (req: IAppRequest, res, next) => {
  Controllers.getAllUserApiKeys(req.uid)
    .then(data => res.json(data))
    .catch(next)
})


// delete an api for an exchange
router.delete('/:exchange', (req: IAppRequest, res, next) => {
  Controllers.deleteApiKey(req.uid, req.params.exchange)
    .then(data => res.json(data))
    .catch(next)
})


export default router
