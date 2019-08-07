import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'
import { Trade } from 'ccxt'


export default class TrailingStopTrigger extends BaseTrigger {
  previousPrice: number
  trail: number
  trailingPoint: number


  /**
   * Note: as of now only supports trailing the price going up (after
   * a buy), on trigger (when the price moves down) you should sell.
   *
   * @param trail        fixed offset from the price
   * @param initialPrice initial price, preferably buy price
   */
  constructor (trigger: Triggers) {
    super(trigger, 'Trailing Stop')

    const params = JSON.parse(trigger.params)
    this.trail = params.trail
    this.previousPrice = params.initialPrice
    this.trailingPoint = params.initialPrice - this.trail
  }


  onTrade (trade: Trade) {
    const { price } = trade

    if (!this.isLive) return
    if (price > this.trailingPoint + this.trail) this.trailingPoint = price - this.trail

    this.previousPrice = price

    if (price <= this.trailingPoint) {
      this.advice('close-position', price, this.triggerDB.amount)
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
