import { Request } from 'express'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as _ from 'underscore'
import * as jwt from 'jsonwebtoken'

import * as Database from './database'


interface IAppRequest extends Request {
  uid: string
}


const jwtSecret = process.env.JWT_SECRET || 'secret_keyboard_cat'


const app = express()
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }))


// authenticate the user
app.use((req:IAppRequest,  res, next) => {
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
  Database.deleteApiKeys(req.uid, req.params.exchange)
  res.json({ success: true })
})


interface ITrigger {
  userId: string
  symbol: string
  exchangeId: string // from ccxt
  strategy: 'stop-loss' | 'take-profit'
  params: any[]
}


// create a new trigger for a user
app.post('/triggers/:exchange/:symbol/:strategy', async (req: IAppRequest, res) => {
  const userId = req.uid
  const symbol = req.params.symbol
  const exchange = req.params.exchange
  const strategy = req.params.strategy
  const params = req.body

  const trigger = await Database.addTrigger(userId, symbol, exchange, strategy, params)
  res.json({ trigger, success: true })
})


// get all existing triggers for a user
app.get('/triggers', async (req: IAppRequest, res) => {
  res.json(await Database.getTriggersForUser(req.uid))
})


// app.get('/trigger', async function ( req, res ){
//   const userId = req.query.userId
//   const triggerDetails = await Controller.getSpecificTriggers(userId)
//   res.send(triggerDetails)
// })


// deconste a trigger for a user
app.get('/deconsteTriggers', async (req: IAppRequest, res) => {
  const userId = req.query.userId
  const deconsteTriggers = await Database.deleteTriggers(userId)
  res.send('deconsted successfully')
})


app.use((err, req, res, next) => {
  console.log(err)
  res.status(500)
  res.json({ error: err.message })
})


export default app
