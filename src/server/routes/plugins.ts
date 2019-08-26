import { Router } from 'express'
import * as _ from 'underscore'

import * as Controllers from '../controllers/plugins'
import { IAppRequest } from 'src/interfaces'

const router = Router()


// get all plugins
router.get('/', async (req: IAppRequest, res) => res.json(await Controllers.fetchAll(req.uid)))


// register a plugin
router.post('/:kind', (req: IAppRequest, res, next) => {
  const kind = req.params.kind
  const params = req.body

  Controllers.register(req.uid, kind, params)
    .then(data => res.json(data))
    .catch(next)
})


router.delete('/:id', (req: IAppRequest, res, next) => {
  Controllers.remove(req.uid, req.params.id)
    .then(data => res.json(data))
    .catch(next)
})


router.put('/:id', (req: IAppRequest, res, next) => {
  Controllers.update(req.uid, req.params.id, req.body)
    .then(data => res.json(data))
    .catch(next)
})


router.post('/:id/enableDisable', (req: IAppRequest, res, next) => {
  const id = req.params.id

  Controllers.enableDisable(req.uid, req.params.id, req.body.action)
    .then(data => res.json(data))
    .catch(next)
})


router.post('/:id/setParams', async (req: IAppRequest, res, next) => {
  Controllers.setConfig(req.uid, req.params.id, req.body)
    .then(data => res.json(data))
    .catch(next)
})

export default router
