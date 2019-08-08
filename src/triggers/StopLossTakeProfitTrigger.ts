import { Trade } from 'ccxt'

import { ICandle } from '../interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from '../database/models/triggers'


/**
 * A stop loss take profit trigger, triggers a buy/sell order when the price exceeds above or drops below a
 * certain point.
 */
export default class StopLossTakeProfitTrigger extends BaseTrigger {
  private readonly action: 'market-buy' | 'market-sell' | 'limit-buy' | 'limit-sell'
  private readonly amount: number
  private readonly stopLossPrice: number
  private readonly takeProfitPrice: number


  constructor (trigger: Triggers) {
    super(trigger, 'Stop Loss & Take Proft')

    const params = JSON.parse(trigger.params)
    this.action = params.action
    this.amount = params.amount
    this.stopLossPrice = params.stopPrice
    this.takeProfitPrice = params.takePrice

    if (this.action !== 'market-buy' && this.action !== 'market-sell' &&
      this.action !== 'limit-buy' && this.action !== 'limit-sell')
      throw new Error('bad/missing action')
    if (!this.stopLossPrice) throw new Error('bad/missing stoploss price')
    if (!this.takeProfitPrice) throw new Error('bad/missing take profit price')
  }


  onTrade (trade: Trade) {
    if (!this.isLive()) return
    const { price } = trade

    if (this.action.endsWith('buy')) {
      // if we go short, then we place buy orders to close our position

      // buy for stoploss

      // if price reaches or goes below the stop loss price, then
      // we close the position with a buy order
      if (price >= this.stopLossPrice) {
        this.advice(this.action, { price, amount: this.amount })
        this.close()
      }

      // buy for take profit

      // if price reaches or goes below the take profit price, then
      // we close the position with a sell order
      if (price <= this.takeProfitPrice) {
        this.advice(this.action, { price, amount: this.amount })
        this.close()
      }
    } else if (this.action.endsWith('sell')) {
      // if we go long, then we place sell orders to close our position

      // sell for stoploss

      // if price reaches or goes above the stop loss price, then
      // we close the position with a sell order
      if (price <= this.stopLossPrice) {
        this.advice(this.action, { price, amount: this.amount })
        this.close()
      }

      // sell for take profit

      // if price reaches or goes above the take profit price, then
      // we close the position with a sell order
      if (price >= this.takeProfitPrice) {
        this.advice(this.action, { price, amount: this.amount })
        this.close()
      }
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
