import * as ccxt from 'ccxt'
import * as debug from 'debug'
import * as _ from 'underscore'

import BaseStrategy from '../../strategies/BaseStrategy'
import { EventEmitter } from 'events'


export default abstract class BaseExchange extends EventEmitter {
  public readonly name: string
  protected exchange: ccxt.Exchange
  protected strategies: BaseStrategy[] = []


  constructor (exchange: ccxt.Exchange) {
    super()

    this.exchange = exchange
    this.name = exchange.name
  }


  /**
   * This abstract function should be implemented by all the exchanges we are integrating with.
   * Here basically a loop or a websocket connection must be started which continously calls
   * this.onPriceUpdate(....) with the latest price for the any of the given symbols.
   */
  protected abstract startListening (): void


  public abstract getTrades (symbol: string, since: number, descending: boolean): Promise<ccxt.Trade[]>


  /**
   * Checks if the exchange can stream trades for the given symbol or not. Streaming happens via
   * websockets or via FIX api.
   *
   * @param symbol The symbol to check for
   */
  public abstract canStreamTrades (symbol: string): boolean


  public start () {
    //Controller.readDetails()
    // 1. load triggers from the DB
    // 2. start listening for price changes
    this.startListening()
    //this.onPriceUpdate()
  }
}
