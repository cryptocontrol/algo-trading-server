import * as ccxt from 'ccxt'
import * as _ from 'underscore'

import BaseStrategy from '../../strategies/BaseStrategy'
import { EventEmitter } from 'events'


export default abstract class BaseExchange extends EventEmitter {
  public readonly id: string
  protected exchange: ccxt.Exchange
  protected strategies: BaseStrategy[] = []


  constructor (exchange: ccxt.Exchange) {
    super()

    this.exchange = exchange
    this.id = exchange.id
  }


  public abstract getTrades (symbol: string, since: number, descending: boolean): Promise<ccxt.Trade[]>
  public abstract streamTrades (symbol: string): void


  /**
   * Checks if the exchange can stream trades for the given symbol or not. Streaming happens via
   * websockets or via FIX api.
   *
   * @param symbol The symbol to check for
   */
  public abstract canStreamTrades (symbol: string): boolean


  public toString () {
    return this.exchange.id
  }
}
