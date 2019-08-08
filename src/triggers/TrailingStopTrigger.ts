import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'
import { Trade } from 'ccxt'


export default class TrailingStopTrigger extends BaseTrigger {
  private readonly amount: number
  private readonly trail: number
  private trailingPoint: number


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
    this.amount = params.amount
    this.trailingPoint = params.initialPrice - this.trail
  }


  onTrade (trade: Trade) {
    if (!this.isLive()) return

    const { price } = trade
    if (price > this.trailingPoint + this.trail) this.trailingPoint = price - this.trail

    if (price <= this.trailingPoint) {
      this.advice('close-position', { price, amount: this.amount })
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
