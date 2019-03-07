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


app.post('/:exchange/key', (req: IAppRequest, res) => {
  Database.addApiKeys(req.uid, req.params.exchange, req.body)
  res.json({ success: true })
})


app.get('/keys', async (req: IAppRequest, res) => {
  const keys = await Database.getKeysForUser(req.uid)

  // encrypt the secret keys
  const parsedKeys = keys.map(key => {
    return {
      ...key,
      params: _.mapObject(key.params, (val, key) => {
        if (key === 'key') return val
        else return val.replace(/./gi, '*')
      })
    }
  })

  res.json(parsedKeys)
})


interface ITrigger {
  userId: string
  symbol: string
  exchangeId: string // from ccxt
  strategy: 'stop-loss' | 'take-profit'
  params: any[]
}


// create a new trigger for a user
app.post('/trigger', (req: IAppRequest, res) => {
  const userId = req.query.userId
  const symbol = req.query.symbol
  const exchangeId = req.query.exchangeId
  const strategy = req.query.strategy
  const stopLossPrice = req.query.stopLossPrice
  const takeProfitPrice = req.query.takeProfitPrice

  Database.addTriggers( userId, symbol, exchangeId, strategy, [stopLossPrice, takeProfitPrice])
  res.json({ success: true })
})


// get all existing triggers for a user
app.get('/triggers', async (req: IAppRequest, res) => res.json(await Database.getTriggers()))


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
