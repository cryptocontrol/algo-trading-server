import { Sequelize } from 'sequelize-typescript'

import UserExchanges from './models/userexchanges'
import log from 'src/utils/log'
import Candles from './models/candles'
import Trades from './models/trades'
import Triggers from './models/triggers'
import Plugins from './models/plugins';


const env = process.env.NODE_ENV || 'development'
const config = require('./config.json')[env]


export const init = () => {
  log.info('init database')

  const sequelize = new Sequelize(config)
  sequelize.addModels([UserExchanges, Candles, Trades, Triggers, Plugins])

  return sequelize
}
