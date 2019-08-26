import * as hat from 'hat'
import { Trade } from 'ccxt'
import { EventEmitter } from 'events'

import BaseExchange from '../exchanges/core/BaseExchange'
import Strategies from '../database/models/strategies'
import { ICandle, IAdvice } from 'src/interfaces'
import log from '../utils/log'


/**
 * A strategy is a trading logic that keeps executing trades based on certain conditions. Unlike triggers,
 * strategies need to be stopped for it to stop executing trades.
 *
 * Useful for creating simple strategies like RSI-based strategy, MACD strategy etc..
 */
export default abstract class BaseStrategy<T> extends EventEmitter {
  protected readonly strategyDB: Strategies
  protected readonly exchange: BaseExchange
  protected readonly name: string
  protected readonly symbol: string
  protected readonly uid: string
  protected readonly requiredHistory: number // todo: use this

  protected params: T


  constructor (name: string, strategyDB: Strategies) {
    super()

    this.strategyDB = strategyDB
    this.uid = hat()
    this.name = name
    this.params = JSON.parse(this.strategyDB.params)
  }


  /**
   * This fn recieves every new trade made for a particular symbol & exchange. Every trigger instance
   * needs to have this fn implemented with it's business logic.
   *
   * Trades are sent by Budfox
   *
   * @param trade the new trade made
   */
  public abstract onTrade (trade: Trade): void


  /**
   * This fn recieves every new candle made for a particular symbol & exchange. Every trigger instance
   * needs to have this fn implemented with it's business logic.
   *
   * Candles are emitted by Budfox
   *
   * @param candle the new candle emitted
   */
  public abstract onCandle (candle: ICandle): void



  public getExchange () {
    return this.strategyDB.exchange
  }


  public getSymbol () {
    return this.strategyDB.symbol
  }


  public getUID () {
    return this.strategyDB.uid
  }


  public getDBId () {
    return this.strategyDB.id
  }


  public isLive () {
    return this.strategyDB.isActive
  }


  public getName () {
    return this.name
  }


  public toString () {
    const exchangeSymbol = `${this.getExchange().toUpperCase()}:${this.getSymbol().toUpperCase()}`
    return `Strategy ${this.name} id:${this.strategyDB.id} ${exchangeSymbol}`
  }


  protected advice (advice: IAdvice, params?: { price?: number, amount?: number, orderId?: string }) {
    if (!this.isLive()) return

    // do nothing
    const strat = this.strategyDB
    log.info(
      `${this.name} strategy on ${strat.exchange}:${strat.symbol} ` +
      `adviced to ${advice} at ${params.price} with a volume of ${params.amount}`
    )

    // mark the trigger as triggered
    // strat.hasTriggered = true
    strat.lastTriggeredAt = new Date
    strat.save()

    this.emit('advice', { advice, ...params })
  }
}
