import { Request } from 'express'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as _ from 'underscore'
import * as jwt from 'jsonwebtoken'

import * as Database from './database'
const packageJson = require('../package.json')


interface IAppRequest extends Request {
  uid: string
}


const jwtSecret = process.env.JWT_SECRET || 'secret_keyboard_cat'


const app = express()
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }))


// authenticate the user
app.use((req:IAppRequest, _res, next) => {
  const token = req.header('x-jwt')

  // verify the jwt token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return next(new Error('invalid jwt token'))
    if (!decoded.id) return next(new Error('invalid user id'))
    req.uid = decoded.id
    next()
  })
})


/**
 * Gets the status of the server. A great way for the terminal to check if the
 * trading server is of the latest version or not.
 */
app.get('/status', (req: IAppRequest, res) => {
  res.json({
    version: packageJson.version,
    uptime: process.uptime()
  })
})


/**
 * Set the API key for an exchange for the logged in user
 */
app.post('/:exchange/key', (req: IAppRequest, res) => {
  Database.addApiKeys(req.uid, req.params.exchange, req.body)
  res.json({ success: true })
})


/**
 * Get all the API keys saved for the logged in user
 */
app.get('/keys', async (req: IAppRequest, res) => {
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
app.delete('/:exchange/key', (req: IAppRequest, res) => {
  Database.deleteApiKey(req.uid, req.params.exchange)
  res.json({ success: true })
})


/**
 * create a new trigger for a user
 */
app.post('/triggers/:exchange/:symbol/:strategy', async (req: IAppRequest, res) => {
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
app.get('/triggers', async (req: IAppRequest, res) => res.json(await Database.getTriggersForUser(req.uid)))


/**
 * Delete a specific trigger
 */
app.delete('/triggers/:exchange/:symbol/:id', async (req: IAppRequest, res) => {
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


app.use((err, req, res, next) => {
  console.log(err)
  res.status(500)
  res.json({ error: err.message })
})


export default app
