/**
 * This is where the HTTP Json server runs. It is what is used by the CryptoControl terminal to
 * communicate with the trading sever.
 */
import { Request } from 'express'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as _ from 'underscore'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'

import * as Database from '../database2'
import InvalidJWTError from 'src/errors/InvalidJWTError'
import NotAuthorizedError from 'src/errors/NotAuthorizedError'
import UserExchanges from 'src/database/models/userexchanges'
import router from './routes'


interface IAppRequest extends Request {
  uid: string
}


const app = express()
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }))


// enable all cors
app.use(cors())

app.use(router)


// authenticate the user using JWT tokens
app.use((req:IAppRequest, _res, next) => {
  const token = req.header('x-jwt')

  const jwtSecret = app.get('secret') || process.env.SERVER_SECRET || 'secret_keyboard_cat'

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
app.get('/me', (req: IAppRequest, res) => res.json({ uid: req.uid }))


/**
 * Set the API key for an exchange for the logged in user
 */
app.post('/:exchange/key', async (req: IAppRequest, res, next) => {
  try {
    const found = await UserExchanges.findOne({
      where: {
        uid: req.uid,
        exchange: req.params.exchange
      }
    })

    if (found) {
      found.apiKey = req.body.key
      found.apiSecret = req.body.secret
      found.apiPassword = req.body.pasword
      await found.save()
      return res.json(found)
    }

    const row = new UserExchanges({
      uid: req.uid,
      exchange: req.params.exchange,
      apiKey: req.body.key,
      apiSecret: req.body.secret,
      apiPassword: req.body.password
    })

    await row.save()
    res.json(row)
  } catch (e) {
    next(e)
  }
})


/**
 * Set the API keys for multiple exchanges for the given user
 */
app.post('/keys', (req: IAppRequest, res) => {
  const data = req.body || []
  data.forEach(data => Database.addApiKeys(req.uid, data.exchange, data.keys))
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


/**
 * Error handler
 */
app.use((err, _req, res, _next) => {
  console.log(err)
  res.status(err.status || 500)
  res.json({ error: err.message })
})


export default app
