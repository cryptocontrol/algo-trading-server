/**
 * This is where the HTTP Json server runs. It is what is used by the CryptoControl terminal to
 * communicate with the trading sever.
 */
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as _ from 'underscore'
import * as cors from 'cors'
import * as jwt from 'jsonwebtoken'

import router from './routes/routes'
import { IAppRequest } from 'src/interfaces'
import InvalidJWTError from 'src/errors/InvalidJWTError'


const app = express()
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }))


// enable all cors
app.use(cors())


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
