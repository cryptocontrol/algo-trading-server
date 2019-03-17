import * as ccxt from 'ccxt'

import BaseExchange from 'src/exchanges/core/BaseExchange'
import CCXTExchange from 'src/exchanges/CCXTExchange'
import BinanceExchange from 'src/exchanges/BinanceExchange'


interface IExchanges {
  [exchangeId: string]: BaseExchange
}


export default class ExchangeManger {
  private readonly exchanges: IExchanges = {}
  private static readonly instance = new ExchangeManger()


  getExchange (exchangeId: string): BaseExchange {
    if (this.exchanges[exchangeId]) return this.exchanges[exchangeId]

    // create a CCXT instance for each exchange; (note that the enableRateLimit should be enabled)
    const ccxtExchange = new ccxt[exchangeId]({ enableRateLimit: true })

    const exchange = this.createBaseExchangeInstance(ccxtExchange)
    this.exchanges[exchangeId] = exchange

    return exchange
  }


  createBaseExchangeInstance (exchange: ccxt.Exchange) {
    if (exchange.id === 'binance') return new BinanceExchange()
    return new CCXTExchange(exchange)
  }


  static getInstance () {
    return ExchangeManger.instance
  }
}
