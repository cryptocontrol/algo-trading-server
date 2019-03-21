import { Router } from 'express'

import { IAppRequest } from 'src/interfaces'
import * as Controllers from '../controllers/advices'

const router = Router()


router.get('/', async (req: IAppRequest, res) => res.json(await Controllers.getAdvices(req.uid)))


export default router
