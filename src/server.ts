import * as express from 'express'
import * as jwt from 'jsonwebtoken'

import * as Database from './database'

const app = express()

const jwtSecret = process.env.JWT_SECRET || 'secret_keyboard_cat'

app.use((req, res, next) => {
  const token = jwt.sign({ id: '123456' }, jwtSecret)
  console.log(token)
  next()

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return next(err)
    console.log(decoded)
    next()
  })
})


app.post('/:exchange/key', function(req, res) {
  const apiKey = req.query.apiKey;
  const secret = req.query.secret;
  const exchange = req.params.exchange

  Database.writeApiKeys(apiKey, secret, exchange)
  res.json({ success: true })
})


app.get('/getData', async function(req, res) {
  const localStorage = await Database.readDetails()
  res.json(localStorage)
})


interface ITrigger {
  userId: string
  symbol: string
  exchangeId: string // from ccxt
  strategy: 'stop-loss' | 'take-profit'
  params: any[]
}


// create a new trigger for a user
app.post('/trigger', function ( req, res) {
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
app.get('/triggers', async (req, res) => res.json(await Database.getTriggers()))


// app.get('/trigger', async function ( req, res ){
//   const userId = req.query.userId
//   const triggerDetails = await Controller.getSpecificTriggers(userId)
//   res.send(triggerDetails)
// })


// deconste a trigger for a user
app.get('/deconsteTriggers', async function ( req, res ) {
  const userId = req.query.userId
  const deconsteTriggers = await Database.deleteTriggers(userId)
  res.send('deconsted successfully')
})


export default app
