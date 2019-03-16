import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'
import { Trade } from 'ccxt';


export default class StopLossTrigger extends BaseTrigger {
  previousPrice: number
  trail: number
  trailingPoint: number


  constructor (trigger: Triggers) {
    super(trigger)

    this.trail = trigger.params.trail
    this.previousPrice = trigger.params.initialPrice
    this.trailingPoint = trigger.params.initialPrice - this.trail
  }


  onTrade (trade: Trade) {
    const { price } = trade

    if (!this.isLive) return
    if (price > this.trailingPoint + this.trail) this.trailingPoint = price - this.trail

    this.previousPrice = price

    if (price <= this.trailingPoint) {
      this.isLive = false
      // this.trigger(this.previousPrice)
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
