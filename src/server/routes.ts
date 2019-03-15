import { Router } from 'express'
import * as _ from 'underscore'

import NotAuthorizedError from 'src/errors/NotAuthorizedError'
import { setAPIKey } from './controllers'
import { IAppRequest } from 'src/interfaces'
import * as Database from '../database2'

const packageJson = require('../../package.json')
const router = Router()


/**
 * Gets the status of the server. A great way for the terminal to check if the
 * trading server is of the latest version or not.
 */
router.get('/', (_req: IAppRequest, res) => {
  res.json({
    sourceCode: 'https://github.com/cryptocontrol/algo-trading-server',
    version: packageJson.version,
    uptime: process.uptime()
  })
})


// For every route henceforth; require the user to be logged in
router.use((req: IAppRequest, _res, next) => {
  if (!req.uid) return next(new NotAuthorizedError)
  next()
})


/**
 * Gets the current user's id
 */
router.get('/me', (req: IAppRequest, res) => res.json({ uid: req.uid }))


/**
 * Set the API key for an exchange for the logged in user
 */
router.post('/:exchange/key', setAPIKey)


/**
 * Set the API keys for multiple exchanges for the given user
 */
router.post('/keys', (req: IAppRequest, res) => {
  const data = req.body || []
  data.forEach(data => Database.addApiKeys(req.uid, data.exchange, data.keys))
  res.json({ success: true })
})


/**
 * Get all the API keys saved for the logged in user
 */
router.get('/keys', async (req: IAppRequest, res) => {
  const exchanges = await Database.getKeysForUser(req.uid)

  // hide the secret keys
  const parsedKeys = _.mapObject(exchanges, params => {
    return _.mapObject(params, (val, key) => {
      if (key === 'key') return val
      return val.replace(/./gi, '*')
    })
  })

  res.json(parsedKeys)
})


/**
 * Delete the API keys for the given exchange for the currently logged in user
 */
router.delete('/:exchange/key', (req: IAppRequest, res) => {
  Database.deleteApiKey(req.uid, req.params.exchange)
  res.json({ success: true })
})


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
