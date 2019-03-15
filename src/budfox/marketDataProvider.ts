import * as _ from 'underscore'
import { EventEmitter } from 'events'

import MarketFetcher from './marketFetcher'
import { ITradesBatchEvent } from './tradeBatcher'
import { Exchange } from 'ccxt';


/**
 * TThe market data provider will fetch data from a datasource on tick. It emits:
 *
 * - `trades`: batch of newly detected trades
 * - `market-update`: after Igunana fetched new trades, this will be the most recent one.
 * - `market-start`: contains the time timestamp of the first trade (a market start event)...
 */
export default class MarketDataProvider extends EventEmitter {
  lastTick = 0
  tickrate: number
  interval: NodeJS.Timeout
  source: MarketFetcher
  marketStarted: boolean = false


  constructor (exchange: Exchange, symbol: string) {
    super()
    this.source = new MarketFetcher(exchange, symbol)

    // relay newly fetched trades
    this.source.on('trades batch', this.relayTrades)
  }


  // HANDLERS
  retrieve = () => this.source.fetch()


  private relayTrades = (event: ITradesBatchEvent) => {
    if (this.marketStarted) {
      this.marketStarted = true
      this.emit('market-start', event.first.timestamp)
    }

    this.emit('market-update', event.last.timestamp)
    this.emit('trades', event)
  }
}
