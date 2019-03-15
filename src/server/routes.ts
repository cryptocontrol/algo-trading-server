import { Router } from 'express'
import * as _ from 'underscore'
import * as Bluebird from 'bluebird'

import { IAppRequest } from 'src/interfaces'
import * as Controllers from './controllers'
import * as Database from '../database2'
import NotAuthorizedError from 'src/errors/NotAuthorizedError'

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



router.post('/:exchange/key', (req: IAppRequest, res, next) => {
  Controllers.setAPIKey(req.uid, req.params.exchange, req.body)
    .then(data => res.json(data))
    .catch(next)
})


/**
 * Set the API keys for multiple exchanges for the given user
 */
router.post('/keys', (req: IAppRequest, res, next) => {
  Bluebird.mapSeries(req.body, (data: any) => Controllers.setAPIKey(req.uid, data.exchange, data.keys))
    .then(data => res.json(data))
    .catch(next)
})


/**
 * Get all the API keys saved for the logged in user
 */
router.get('/keys', async (req: IAppRequest, res, next) => {
  Controllers.getAllUserApiKeys(req.uid)
    .then(data => {

      // hide the secret keys
      const parsedKeys = data.map(row => {
        const json = row.toJSON()
        return _.mapObject(json, (val, key) => {
          if (key !== 'apiSecret' && key !== 'apiPassword' || !val) return val
          return val.replace(/./gi, '*')
        })
      })

      res.json(parsedKeys)
    })
    .catch(next)
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
