/**
 * This is the starting point of the application. Here we initialize the database and start the server..
 */
import { Exchange } from 'ccxt'
import * as ccxt from 'ccxt'
import CCXTExchange from './exchanges/CCXTExchange'
import BudFox from './budfox/budfox';

const enabledExchanges = ['binance']



export const start = () => {
  // create a CCXT instance for each exchange; (note that the enableRateLimit should be enabled)
  const ccxtInstances: Exchange[] = enabledExchanges.map(ex => new ccxt[ex]({ enableRateLimit: true }))

  const exchanges = ccxtInstances.map(inst => new CCXTExchange(inst))

  // connect all plugins \

  const budfox = new BudFox(exchanges[0], 'BTCUSDT')
  // budfox.on('trade')
}
// start all the exchanges listeners
// const binance = new Binance()
// binance.startListening()
