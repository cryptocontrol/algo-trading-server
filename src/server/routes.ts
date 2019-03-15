/**
 * This is where the HTTP Json server runs. It is what is used by the CryptoControl terminal to
 * communicate with the trading sever.
 */
import { Router } from 'express'
import * as _ from 'underscore'
import * as jwt from 'jsonwebtoken'

import InvalidJWTError from 'src/errors/InvalidJWTError'
import NotAuthorizedError from 'src/errors/NotAuthorizedError'
import { setAPIKey } from './controllers'
import { IAppRequest } from 'src/interfaces'
const packageJson = require('../../package.json')


const router = Router()


/**
 * Redirect to the github page
 */
router.get('/', (_req, res) => res.redirect('https://github.com/cryptocontrol/algo-trading-server'))


/**
 * Gets the status of the server. A great way for the terminal to check if the
 * trading server is of the latest version or not.
 */
router.get('/status', (_req: IAppRequest, res) => {
  res.json({
    version: packageJson.version,
    uptime: process.uptime()
  })
})


// authenticate the user using JWT tokens
router.use((req: IAppRequest, _res, next) => {
  const token = req.header('x-jwt')

  const jwtSecret = router.get('secret') || process.env.SERVER_SECRET || 'secret_keyboard_cat'

  // verify the jwt token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return next(new InvalidJWTError)
    if (!decoded.uid) return next(new NotAuthorizedError)
    req.uid = decoded.uid
    next()
  })
})


/**
 * Gets the current user's id
 */
router.get('/me', (req: IAppRequest, res) => res.json({ uid: req.uid }))


/**
 * Set the API key for an exchange for the logged in user
 */
router.post('/:exchange/key', setAPIKey)


export default router
