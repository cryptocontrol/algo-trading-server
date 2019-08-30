import { Router } from 'express'
import * as _ from 'underscore'

import * as Controllers from '../controllers/plugins'
import { IAppRequest } from 'src/interfaces'

const router = Router()


// get all plugins
router.get('/', async (req: IAppRequest, res) => res.json(await Controllers.getPlugins(req.uid)))

// register a plugin
router.post('/:kind', async (req: IAppRequest, res) => {
  const uid = req.uid
  const kind = req.params.kind
  const params = req.body

  const plugin = await Controllers.regsiterPlugin(uid, kind, params)
  res.json({ plugin, success: true })
})


router.delete('/:id', async (req: IAppRequest, res) => {
  const uid = req.uid
  const id = Number(req.params.id)

  await Controllers.deleteplugin(uid, id)
  res.json({ success: true })
})


router.put('/:id', async (req: IAppRequest, res) => {
  const uid = req.uid
  const id = req.params.id

  await Controllers.updatePlugin(uid, id, req.body)
  res.json({ success: true })
})

router.post('/enableDisable/:id', async (req: IAppRequest, res) => {
  const id = req.params.id

  res.json(await Controllers.enableDisablePlugin(req.uid, id, req.body.action))
})

router.post('/setParams', async (req: IAppRequest, res) => res.json(await Controllers.setTelegramParams(req.uid, req.body.chatId)))

export default router
