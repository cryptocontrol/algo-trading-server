import * as _ from 'underscore'
import { EventEmitter } from 'events'
import { Trade } from 'ccxt'

import TradeBatcher, { ITradesBatchEvent } from './tradeBatcher'
import BaseExchange from 'src/exchanges/core/BaseExchange'
import Heart from './heart'
import log from 'src/utils/log'
import Trades from 'src/database/models/trades'


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

    this.heart = new Heart()
    this.batcher = new TradeBatcher

    // connect the heart to the fetch fn
    this.heart.on('tick', this.fetch)

    // relay newly fetched trades
    this.batcher.on('new batch', this.relayTrades)
  }


  public start () {
    // first fetch the first set of trades
    this.fetch()

    // check if the exchange has streaming capabilities
    if (this.exchange.canStreamTrades(this.symbol)) {
      // then we start streaming trades in real-time
      this.exchange.on('trade', e => this.processTrades([e]))
      return
    }

    // else we poll the exchange; (by starting the heart!)
    this.heart.pump()
  }


  private relayTrades = (e: ITradesBatchEvent) => {
    if (this.marketStarted) {
      this.marketStarted = true
      this.emit('market-start', e.first.timestamp)
    }

    this.emit('market-update', e.last.timestamp)
    this.emit('trades', e)
    this.emit('trade', e.last)

    e.trades.forEach(trade => {
      const t = new Trades({
        exchange: this.exchange.name,
        price: trade.price,
        symbol: this.symbol,
        tradedAt: new Date(trade.timestamp),
        tradeId: trade.id,
        volume: trade.amount
      })

      t.save().catch(_.noop)
    })
  }


  fetch = async () => {
    let since

    // if (this.firstFetch) {
    //   since = this.firstSince
    //   this.firstFetch = false
    // }

    // this.tries = 0
    log.debug('Requested', this.symbol, 'trade data from', this.exchange.name, '...')

    const trades = await this.exchange.getTrades(this.symbol, since, false)
    this.processTrades(trades)
    // .catch(e => {
    //   log.warn(this.exchange.name, 'returned an error while fetching trades:', e)
    //   log.debug('refetching...')
    // })
  }


  private processTrades (trades: Trade[]) {
    if (_.isEmpty(trades)) {
      log.debug('Trade fetch came back empty, refetching...')
      // setTimeout(this._fetch, +moment.duration(1, 's'))
      return
    }

    this.batcher.write(trades)
  }
}
