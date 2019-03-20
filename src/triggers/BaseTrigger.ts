import { Trade } from 'ccxt'
import * as EventEmitter from 'events'

import { ICandle, IAdvice } from 'src/interfaces'
import Triggers from 'src/database/models/triggers'
import log from 'src/utils/log'


// Note: as of now only supports trailing the price going up (after
// a buy), on trigger (when the price moves down) you should sell.

// @param initialPrice: initial price, preferably buy price
// @param trail: fixed offset from the price
// @param onTrigger: fn to call when the stop triggers
export default abstract class BaseTrigger extends EventEmitter {
  public readonly name: string
  protected isLive: boolean = true
  protected readonly triggerDB: Triggers


  constructor (triggerDB: Triggers, name: string = 'Unkown') {
    super()
    this.name = name
    this.triggerDB = triggerDB
    this.isLive = !triggerDB.hasTriggered
  }


  public abstract onTrade (trade: Trade): void
  public abstract onCandle (candle: ICandle): void


  public getExchange () {
    return this.triggerDB.exchange
  }


  public getSymbol () {
    return this.triggerDB.symbol
  }


  protected advice (advice: IAdvice, price: number, amount: number) {
    // do nothing
    const trigger = this.triggerDB
    log.info(
      `${trigger.kind} trigger for user ${trigger.uid} on ${trigger.exchange} ${trigger.symbol} ` +
      `adviced to ${advice} at ${price} for a volume of ${amount}`
    )

    // mark the trigger as triggered
    trigger.hasTriggered = true
    trigger.lastTriggeredAt = new Date
    trigger.save()
  }


  protected close () {
    this.isLive = false
    this.emit('close')

    // mark the trigger as closed in the DB
    this.triggerDB.isActive = false
    this.triggerDB.closedAt = new Date
    this.triggerDB.save()
  }
}
