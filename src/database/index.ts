import { Sequelize } from 'sequelize-typescript'

import Advices from './models/advices'
import Candles from './models/candles'
import log from 'src/utils/log'
import Plugins from './models/plugins'
import Trades from './models/trades'
import Triggers from './models/triggers'
import UserExchanges from './models/userexchanges'


const env = process.env.NODE_ENV || 'development'
const config = require('./config.json')[env]


export const init = () => {
  log.info('init database')

  const sequelize = new Sequelize(config)
  sequelize.addModels([UserExchanges, Candles, Trades, Triggers, Plugins, Advices])

  return sequelize
}
