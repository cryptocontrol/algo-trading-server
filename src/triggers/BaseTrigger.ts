import { Trade } from 'ccxt'
import * as EventEmitter from 'events'

import { ICandle } from 'src/interfaces'
import Triggers from 'src/database/models/triggers'
import log from 'src/utils/log';


// Note: as of now only supports trailing the price going up (after
// a buy), on trigger (when the price moves down) you should sell.

// @param initialPrice: initial price, preferably buy price
// @param trail: fixed offset from the price
// @param onTrigger: fn to call when the stop triggers
export default abstract class BaseTrigger extends EventEmitter {
  protected isLive: boolean = true
  protected readonly triggerDB: Triggers


  constructor (triggerDB: Triggers) {
    super()
    this.triggerDB = triggerDB
    this.isLive = !triggerDB.hasTriggered
  }


  public abstract onTrade (trade: Trade): void
  public abstract onCandle (candle: ICandle): void


  protected advice (advice: 'long' | 'short' | 'close-position' | 'do-nothing', price: number, amount: number) {
    // do nothing
    log.debug(
      `${this.triggerDB.kind} trigger ${this.triggerDB.exchange} ${this.triggerDB.symbol} ` +
      `adviced to ${advice} at ${price} for a volume of ${amount}`
    )
  }


  protected close () {
    this.isLive = false
    this.emit('close')
  }
}
