import { Router } from 'express'
import * as _ from 'underscore'

import { IAppRequest } from 'src/interfaces'
import * as Controllers from '../controllers/triggers'

const router = Router()


/**
 * create a new trigger for a user
 */
router.post('/:kind', async (req: IAppRequest, res) => {
  const uid = req.uid

  const { symbol, exchange, kind: _kind, ...params } = req.body
  const kind = req.params.kind

  const trigger = await Controllers.createTrigger(uid, exchange, symbol, kind, params)
  res.json({ trigger, success: true })
})


/**
 * get all existing triggers for a user
 */
router.get('/', async (req: IAppRequest, res) => res.json(await Controllers.getTriggers(req.uid)))


/**
 * Delete a specific trigger
 */
router.delete('/:id', async (req: IAppRequest, res) => {
  const uid = req.uid
  const id = Number(req.params.id)

  await Controllers.deleteTrigger(uid, id)

  res.json({ success: true })
})


export default router
