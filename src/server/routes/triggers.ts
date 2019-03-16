import { Router } from 'express'
import * as _ from 'underscore'

import { IAppRequest } from 'src/interfaces'
import * as Controllers from '../controllers/triggers'

const router = Router()


/**
 * create a new trigger for a user
 */
router.post('/triggers/:exchange/:symbol/:strategy', async (req: IAppRequest, res) => {
  const uid = req.uid
  const symbol = req.params.symbol
  const exchange = req.params.exchange
  const strategy = req.params.strategy
  const params = req.body

  const trigger = await Controllers.createTrigger(uid, symbol, exchange, strategy, params)
  res.json({ trigger, success: true })
})


/**
 * get all existing triggers for a user
 */
router.get('/triggers', async (req: IAppRequest, res) => res.json(await Controllers.getTriggers(req.uid)))


/**
 * Delete a specific trigger
 */
router.delete('/triggers/:id', async (req: IAppRequest, res) => {
  const uid = req.uid
  const id = Number(req.params.id)

  await Controllers.deleteTrigger(uid, id)

  res.json({ success: true })
})


export default router
