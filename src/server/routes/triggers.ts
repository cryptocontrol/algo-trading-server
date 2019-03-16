import { Router } from 'express'
import * as _ from 'underscore'

import { IAppRequest } from 'src/interfaces'
import * as Database from '../../database2'

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

  const trigger = await Database.addTrigger(uid, symbol, exchange, strategy, params)
  res.json({ trigger, success: true })
})


/**
 * get all existing triggers for a user
 */
router.get('/triggers', async (req: IAppRequest, res) => res.json(await Database.getTriggersForUser(req.uid)))


/**
 * Delete a specific trigger
 */
router.delete('/triggers/:exchange/:symbol/:id', async (req: IAppRequest, res) => {
  const uid = req.uid
  const symbol = req.params.symbol
  const exchange = req.params.exchange
  const id = req.params.id

  const trigger = await Database.getTrigger(exchange, symbol, id)

  if (!trigger) throw new Error('no such trigger')
  if (trigger.uid !== uid) throw new Error('not your trigger')

  await Database.deleteTrigger(exchange, symbol, id)
  res.json({ success: true })
})


/**
 * Error handler
 */
router.use((err, _req, res, _next) => {
  console.log(err)
  res.status(err.status || 500)
  res.json({ error: err.message })
})


export default router
