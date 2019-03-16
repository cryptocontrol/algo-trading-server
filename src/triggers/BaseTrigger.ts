import { Trade } from 'ccxt'
import * as EventEmitter from 'events'

import { ICandle } from 'src/interfaces'
import Triggers from 'src/database/models/triggers'

// Note: as of now only supports trailing the price going up (after
// a buy), on trigger (when the price moves down) you should sell.


// @param initialPrice: initial price, preferably buy price
// @param trail: fixed offset from the price
// @param onTrigger: fn to call when the stop triggers
export default abstract class BaseTrigger extends EventEmitter {
  protected isLive: boolean = true
  protected readonly triggerDB


  constructor (triggerDB: Triggers) {
    super()
    this.triggerDB = triggerDB
  }


  public abstract onTrade (trade: Trade): void
  public abstract onCandle (candle: ICandle): void


  advice (reason: 'long' | 'short' | 'close-position' | 'do-nothing', price: number, amount: number) {
    // do nothing
  }
}
