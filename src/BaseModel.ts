import * as hat from 'hat'
import { Trade } from 'ccxt'
import { EventEmitter } from 'events'

import { ICandle } from 'src/interfaces'


/**
 * A strategy is a trading logic that keeps executing trades based on certain conditions. Unlike triggers,
 * strategies need to be stopped for it to stop executing trades.
 *
 * Useful for creating simple strategies like RSI-based strategy, MACD strategy etc..
 */
export default abstract class BaseModel<T> extends EventEmitter {
  // protected readonly strategyDB: Strategies
  // protected readonly exchange: BaseExchange
  protected readonly name: string
  protected readonly symbol: string
  protected readonly uid: string

  protected params: T


  constructor (name: string) {
    super()

    this.uid = hat()
    this.name = name
    // this.params = JSON.parse(this.strategyDB.params)
  }
}
