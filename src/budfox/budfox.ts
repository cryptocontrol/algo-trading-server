import MarketDataProvider from './marketDataProvider'
import { EventEmitter } from 'events'
import BaseExchange from 'src/exchanges/core/BaseExchange'
import CandleCreator from './candleCreator'
import { ICandle } from 'src/interfaces'

/**
 * Budfox is the realtime market for Iguana! It was initially built by the team
 * that built Gekko but was modified to support CCXT exchanges and websocket connections.
 *
 * Budfox takes an exchange and a symbol, and tracks all new trades and emits out candles.
 *
 * Read more here what Budfox does (Gekko's version):
 * @link https://github.com/askmike/gekko/blob/stable/docs/internals/budfox.md
 */
export default class BudFox extends EventEmitter {
  marketDataProvider: MarketDataProvider
  candlesCreator: CandleCreator


  constructor (exchange: BaseExchange, symbol: string) {
    super()

    // init the different components
    this.marketDataProvider = new MarketDataProvider(exchange, symbol)
    this.candlesCreator = new CandleCreator

    // connect them together

    // on new trade data create candles and output it
    this.marketDataProvider.on('trades', this.candlesCreator.write);
    this.candlesCreator.on('candles', this.pushCandles)

    // relay a market-start and market-update event
    this.marketDataProvider.on('market-start', e => this.emit('market-start', e))
    this.marketDataProvider.on('market-update', e => this.emit('market-update', e))

    // once everything is connected, we start the market data provider
    this.marketDataProvider.start()
  }


  private pushCandles (candles: ICandle[]) {
    // do something
    // _.each(candles, this.push);
  }
}
