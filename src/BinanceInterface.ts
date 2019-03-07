import * as ccxt from 'ccxt'
import Binance from 'binance-api-node'

import ExchangeInterface from './ExchangeInterface'


export default class BinanceInterface extends ExchangeInterface {
  constructor () {
    const binance = new ccxt.binance()
    super(binance)
  }


  startListening(): void {
    const client = Binance()
    client.ws.trades(['BTCUSDT'], trade => this.onPriceUpdate('BTC/USDT', Number(trade.price)))
  }
}
