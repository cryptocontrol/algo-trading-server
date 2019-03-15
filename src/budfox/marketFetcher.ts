import * as moment from 'moment'
import * as _ from 'underscore'
import { EventEmitter } from 'events'

import log from 'src/utils/log'
import CCXTExchange from 'src/exchanges/CCXTExchange'
import BaseExchange from 'src/exchanges/core/BaseExchange'
import TradeBatcher from './tradeBatcher'
import { Trade, Exchange } from 'ccxt';


/**
 * The fetcher is responsible for fetching new market data at the exchange on interval. It will emit
 * the following events:
 *
 * - `trades batch` - all new trades.
 * - `trade` - the most recent trade after every fetch
 */
export default class MarketFetcher extends EventEmitter {
  exchange: BaseExchange
  symbol: string
  batcher: TradeBatcher

  // if the exchange returns an error
  // we will keep on retrying until next
  // scheduled fetch.
  tries: number = 0
  limit: number = 20
  firstFetch: boolean = true
  firstSince: number = 0


  constructor (exchange: Exchange, symbol: string) {
    super()

    const ex = new CCXTExchange(exchange)
    this.exchange = ex
    this.symbol = symbol

    this.batcher = new TradeBatcher

    log.info('Starting to watch the market:', ex.name, symbol)

    this.batcher.on('new batch', e => this.emit('trades batch', e))
  }


  private _fetch = async (since) => {
    if (++this.tries >= this.limit) return
    const trades = await this.exchange.getTrades(since, false)
    this.processTrades(trades)
  }


  fetch () {
    let since = false
    // if (this.firstFetch) {
    //   since = this.firstSince
    //   this.firstFetch = false
    // } else since = false

    this.tries = 0
    log.debug('Requested', this.symbol, 'trade data from', this.exchange.name, '...')

    this._fetch(since)
    .catch(e => {
      log.warn(this.exchange.name, 'returned an error while fetching trades:', e)
      log.debug('refetching...')
    })
  }


  processTrades (trades: Trade[]) {
    if (_.isEmpty(trades)) {
      log.debug('Trade fetch came back empty, refetching...')
      setTimeout(this._fetch, +moment.duration(1, 's'))
      return
    }

    this.batcher.write(trades)
  }
}
