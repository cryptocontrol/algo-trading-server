import { Trade } from 'ccxt'
import * as EventEmitter from 'events'

import { ICandle, IAdvice } from 'src/interfaces'
import Triggers from '../database/models/triggers'
import log from '../utils/log'


/**
 * A trigger is an event that is executed once (or multiple times) when certain
 * conditions are met.
 *
 * The most common examples of triggers are stop-losses and take profit triggers.
 *
 * This is an abstract, any trigger that follows this layout needs to implement the fns. below
 */
export default abstract class BaseTrigger extends EventEmitter {
  public readonly name: string
  protected readonly triggerDB: Triggers


  constructor (triggerDB: Triggers, name: string = 'Unkown') {
    super()
    this.name = name
    this.triggerDB = triggerDB
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
    return this.triggerDB.exchange
  }


  public getSymbol () {
    return this.triggerDB.symbol
  }


  public getUID () {
    return this.triggerDB.uid
  }


  public getDBId () {
    return this.triggerDB.id
  }


  public isLive () {
    return this.triggerDB.isActive
  }


  protected advice (advice: IAdvice, params?: { price?: number, amount?: number, orderId?: string }) {
    if (!this.isLive()) return

    // do nothing
    const trigger = this.triggerDB
    log.info(
      `${trigger.kind} trigger for user ${trigger.uid} on ${trigger.exchange} ${trigger.symbol} ` +
      `adviced to ${advice} at ${params.price} for an amount of ${params.amount}`
    )

    // mark the trigger as triggered
    trigger.hasTriggered = true
    trigger.lastTriggeredAt = new Date
    trigger.save()

    this.emit('advice', { advice, ...params })
  }


  protected close () {
    if (!this.isLive()) return

    const trigger = this.triggerDB
    log.info(`${trigger.kind} trigger for user ${trigger.uid} on ${trigger.exchange} ${trigger.symbol} closed`)

    this.emit('close')

    // mark the trigger as closed in the DB
    this.triggerDB.isActive = false
    this.triggerDB.closedAt = new Date
    this.triggerDB.save()
  }
}
