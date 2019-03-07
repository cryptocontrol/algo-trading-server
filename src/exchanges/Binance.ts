import * as ccxt from 'ccxt'
import BinanceApi from 'binance-api-node'

import BaseExchange from './BaseExchange'


export default class Binance extends BaseExchange {
  constructor () {
    const binance = new ccxt.binance()
    super(binance)
  }


  startListening(): void {
    const client = BinanceApi()
    client.ws.trades(['BTCUSDT'], trade => this.onPriceUpdate('BTCUSDT', Number(trade.price)))
  }
}
