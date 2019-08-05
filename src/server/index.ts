/**
 * This is where the HTTP Json server runs. It is what is used by the CryptoControl terminal to
 * communicate with the trading sever.
 */
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as _ from 'underscore'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'
import * as morgan from 'morgan'

import router from './routes'
import { IAppRequest } from 'src/interfaces'
import InvalidJWTError from 'src/errors/InvalidJWTError'


const app = express()
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }))
app.use(morgan())


// enable all cors
app.use(cors())


import * as ccxt from 'ccxt'
const cache = {}
app.get('/balance/:exchange', (req: IAppRequest, res, next) => {
	const { exchange } = req.params
  const binance = new ccxt.binance({
    apiKey: 'LgbBdOWwDXSOmu28JOJp64qJA6zJXph6uBmG1snlffGCzCHQMmK1uXKPUTDPY1Uc',
    secret: 'ikT1GLusBcOYgqHJO9fgyyuKDuEhVuHrxQXO0LCpspSAFHKCvoQO2Bb67PoYkwuQ'
  })

  const bitfinex = new ccxt.bitfinex({
    // apiKey: 'LgbBdOWwDXSOmu28JOJp64qJA6zJXph6uBmG1snlffGCzCHQMmK1uXKPUTDPY1Uc',
    // secret: 'ikT1GLusBcOYgqHJO9fgyyuKDuEhVuHrxQXO0LCpspSAFHKCvoQO2Bb67PoYkwuQ'
  })

  if (cache[exchange]) return res.json(cache[exchange])

  binance.fetchBalance()
  .then(balance => {
    cache[exchange] = balance
    setTimeout(() => delete cache[exchange], 5000)

    res.json(balance)
  })
  .catch(next)
})

// authenticate the user using JWT tokens
app.use((req: IAppRequest, _res, next) => {
  const token = req.header('x-jwt')

  const jwtSecret = app.get('secret') || process.env.SERVER_SECRET || 'secret_keyboard_cat'

  if (!token) return next()

  // verify the jwt token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return next(new InvalidJWTError)
    req.uid = decoded.uid
    next()
  })
})


// install routes
app.use(router)


export default app
