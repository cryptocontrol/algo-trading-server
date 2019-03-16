import { EventEmitter } from 'events'
import { ICandle } from 'src/interfaces'
import BaseExchange from 'src/exchanges/core/BaseExchange'
import CandleCreator from './candleCreator'
import MarketDataProvider from './marketDataProvider'
import { Readable } from 'stream';


/**
 * Budfox is the realtime market for Iguana! It was initially built by the team
 * that built Gekko but was modified to support CCXT exchanges and websocket connections.
 *
 * Budfox takes an exchange and a symbol, and tracks all new trades and emits out candles.
 *
 * Read more here what Budfox does (Gekko's version):
 * @link https://github.com/askmike/gekko/blob/stable/docs/internals/budfox.md
 */
export default class BudFox extends Readable {
  marketDataProvider: MarketDataProvider
  candlesCreator: CandleCreator


  constructor (exchange: BaseExchange, symbol: string) {
    super()
    console.log('init budfox for', exchange.name, symbol)

    // init the different components
    this.marketDataProvider = new MarketDataProvider(exchange, symbol)
    this.candlesCreator = new CandleCreator

    // connect them together

    // on new trade data create candles and stream it
    this.marketDataProvider.on('trades', this.candlesCreator.write)
    this.candlesCreator.on('candles', candles => candles.forEach(c => this.push(c)))

    // relay a market-start, market-update and trade events
    this.marketDataProvider.on('market-start', e => this.emit('market-start', e))
    this.marketDataProvider.on('market-update', e => this.emit('market-update', e))
    this.marketDataProvider.on('trade', e => this.emit('trade', e))
    this.marketDataProvider.on('trades', e => this.emit('trades', e))

    // once everything is connected, we start the market data provider
    // this.marketDataProvider.start()
  }
}
