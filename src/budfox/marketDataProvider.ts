import * as _ from 'underscore'
import { EventEmitter } from 'events'
import { Trade } from 'ccxt'

import TradeBatcher, { ITradesBatchEvent } from './tradeBatcher'
import BaseExchange from '../exchanges/core/BaseExchange'
import Heart from './heart'
import log from '../utils/log'


/**
 * The market data provider will fetch data from a datasource on tick. It emits:
 *
 * - `trades`: batch of newly detected trades
 * - `trade`: the last new trade
 * - `market-update`: after Igunana fetched new trades, this will be the most recent one.
 * - `market-start`: contains the time timestamp of the first trade (a market start event)...
 */
export default class MarketDataProvider extends EventEmitter {
  private exchange: BaseExchange
  private heart: Heart
  private marketStarted: boolean = false
  private symbol: string
  private firstFetch: boolean = true
  private batcher: TradeBatcher


  constructor (exchange: BaseExchange, symbol: string) {
    super()

    this.exchange = exchange
    this.symbol = symbol

    this.heart = new Heart
    this.batcher = new TradeBatcher

    // relay newly fetched trades
    this.batcher.on('new batch', this.relayTrades)
  }


  public start () {
    // first fetch the first set of trades
    // this.fetch() // don't do this;

    // then we start streaming trades in real-time
    this.exchange.on('trade', (trade: Trade) => {
      if (trade.symbol === this.symbol) this.processTrades([trade])
    })

    log.debug('Streaming', this.symbol, 'trades from', this.exchange.id, '...')
    this.exchange.streamTrades(this.symbol)
  }


  public stop () {
    this.exchange.stopStreamingTrades(this.symbol)
  }


  private relayTrades = (e: ITradesBatchEvent) => {
    if (!e.trades) return

    if (this.marketStarted) {
      this.marketStarted = true
      this.emit('market-start', e.first.timestamp)
    }

    this.emit('market-update', e.last.timestamp)
    this.emit('trades', e.trades)
    this.emit('trade', e.last)
  }


  private processTrades (trades: Trade[]) {
    if (_.isEmpty(trades)) {
      log.debug('trade fetch came back empty, refetching...')
      // setTimeout(this._fetch, +moment.duration(1, 's'))
      return
    }

    console.log(trades)
    this.batcher.write(trades)
  }
}
