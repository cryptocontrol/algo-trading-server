import { Trade } from 'ccxt'

import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'
import { isNumber } from 'util'


export default class TakeProfitTrigger extends BaseTrigger {
  private readonly action: 'market-buy' | 'market-sell' | 'limit-buy' | 'limit-sell'
  private readonly amount: number
  private readonly price: number


  constructor (trigger: Triggers) {
    super(trigger, 'Take Profit')

    const params = JSON.parse(trigger.params)
    this.action = params.action
    this.amount = params.amount
    this.price = params.price

    if (this.action !== 'market-buy' && this.action !== 'market-sell' &&
      this.action !== 'limit-buy' && this.action !== 'limit-sell')
      throw new Error('bad/missing action')
    if (this.price && !isNumber(this.price)) throw new Error('bad price')
    if (!this.amount || !isNumber(this.amount)) throw new Error('bad/missing amount')
  }


  onTrade (trade: Trade) {
    if (!this.isLive) return
    const { price } = trade

    // if price reaches or goes below the take profit price, then
    // we close the position with a sell order
    if (this.action.endsWith('buy') && price <= this.price) {
      this.advice(this.action, { price, amount: this.amount })
      this.close()
    }

    // if price reaches or goes above the take profit price, then
    // we close the position with a sell order
    if (this.action.endsWith('sell') && price >= this.price) {
      this.advice(this.action, { price, amount: this.amount })
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
