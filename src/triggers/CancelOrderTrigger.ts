import { Trade } from 'ccxt'

import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'
import { isNumber } from 'util'


/**
 * Cancel order trigger enables to cancel an order at various conditons which
 * would enable the user to have buy and sell walls
 */

export default class CancelOrderTrigger extends BaseTrigger {
  private readonly orderId: string
  private readonly condition: 'greater-than'| 'greater-than-equal' | 'less-than' | 'less-than-equal'
  private readonly targetPrice: number


  constructor(trigger: Triggers) {
    super(trigger, 'Cancel Order')

    const params = JSON.parse(trigger.params)
    this.orderId = params.orderId
    this.condition = params.condition
    this.targetPrice = params.price


    // check for missing condition
    if (['greater-than', 'greater-than-equal', 'less-than', 'less-than-equal'].indexOf(this.condition) === -1)
      throw new Error('bad/missing condition')

    if (!this.orderId) throw new Error('bad/missing order id')
    if (!this.targetPrice || !isNumber(this.targetPrice)) throw new Error('bad/missing price')
  }


  onTrade(trade: Trade) {
    // if the prices are not live than return
    if (!this.isLive()) return

    // get current price
    const { price } = trade

    // if the price satisfies the target price and condition pair then
    // trigger an cancel order request
    if (
      price <= this.targetPrice && this.condition.toString() === 'less-than-equal' ||
      price < this.targetPrice && this.condition.toString() === 'less-than' ||
      price >= this.targetPrice && this.condition.toString() === 'greater-than-equal' ||
      price > this.targetPrice && this.condition.toString() === 'greater-than'
    ) {
      // emit a cancel order adivce for advice manager
      this.advice('cancel-order', { orderId: this.orderId })

      // emit a close event for the trigger
      this.close()
    }
  }


  onCandle(candle: ICandle) {
    // do nothing
  }
}
