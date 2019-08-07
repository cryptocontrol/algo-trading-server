import { Trade } from 'ccxt'
import * as _ from 'underscore'

import { EventEmitter } from 'events'
import { ICandle } from '../interfaces'
import BaseExchange from '../exchanges/core/BaseExchange'
import CandleCreator from './candleCreator'
import Candles from '../database/models/candles'
import log from '../utils/log'
import MarketDataProvider from './marketDataProvider'
import Trades from '../database/models/trades'


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
  private readonly marketDataProvider: MarketDataProvider
  private readonly candlesCreator: CandleCreator
  public readonly exchange: BaseExchange
  public readonly symbol: string


  constructor (exchange: BaseExchange, symbol: string) {
    super()
    log.debug('init budfox for', exchange.id, symbol)
    this.exchange = exchange
    this.symbol = symbol

    // init the different components
    this.marketDataProvider = new MarketDataProvider(exchange, symbol)
    this.candlesCreator = new CandleCreator

    // connect them together

    // on new trade data create candles and stream it
    this.marketDataProvider.on('trades', this.candlesCreator.write)
    this.candlesCreator.on('candles', this.processCandles)

    // relay a market-start, market-update and trade events
    this.marketDataProvider.on('market-start', e => this.emit('market-start', e))
    this.marketDataProvider.on('market-update', e => this.emit('market-update', e))
    this.marketDataProvider.on('trades', this.processTrades)

    // once everything is connected, we start the market data provider
    this.marketDataProvider.start()
  }


  private processCandles = (candles: ICandle[]) => {
    candles.forEach(c => {
      // write to stream
      this.emit('candle', c)

      // save into the DB
      const candle = new Candles({
        open: c.open,
        high: c.high,
        low: c.low,
        volume: c.volume,
        close: c.close,
        vwp: c.vwp,
        start: c.start,
        trades: c.trades,
        exchange: this.exchange.id,
        symbol: this.symbol
      })

      candle.save().catch(_.noop)
    })
  }


  private processTrades = (trades: Trade[]) => {
    trades.forEach(t => {
      this.emit('trade', t)

      const trade = new Trades({
        exchange: this.exchange.id,
        price: t.price,
        symbol: this.symbol,
        tradedAt: new Date(t.timestamp),
        side: t.side,
        tradeId: String(t.id),
        volume: t.amount
      })

      trade.save().catch(_.noop)
    })
  }


  public _read () {
    // do nothing
  }


  /**
   * Stop budfox
   */
  public murder () {
    log.debug('murdered budfox for', this.exchange.id, this.symbol)
    this.marketDataProvider.stop()
  }
}
