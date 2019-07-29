import { Trade } from 'ccxt'

import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'


/**
 * A stop loss take profit trigger, triggers a buy/sell order when the price exceeds above or drops below a
 * certain point.
 */
export default class StopLossTakeProfitTrigger extends BaseTrigger {
  action: 'buy' | 'sell'
  type: 'market' | 'limit'
  stopLossPrice: number
  takeProfitPrice: number


  constructor (trigger: Triggers) {
    super(trigger, 'Stop Loss')

    const params = JSON.parse(trigger.params)
    this.action = params.action
    this.type = params.type
    // target price to achive stop loss
    this.stopLossPrice = params.stopLossPrice
    // target price to achive take profit
    this.takeProfitPrice = params.takeProfitPrice

    if (params.action !== 'buy' && params.action !== 'sell') throw new Error('bad/missing action')
    if (params.type !== 'market' && params.type !== 'limit') throw new Error('bad/missing type')
    if (!params.stopLossPrice) throw new Error('bad/missing stoploss price')
    if (!params.takeProfitPrice) throw new Error('bad/missing take profit price')
  }


  onTrade (trade: Trade) {
    if (!this.isLive()) return
    const { price } = trade

    if (this.action === 'buy') {
      // if we go short, then we place buy orders to close our position

      // buy for stoploss

      // if price reaches or goes below the stop loss price, then
      // we close the position with a buy order
      if (price >= this.stopLossPrice) {
        if (this.type === 'limit') this.advice('limit-buy', price, this.triggerDB.amount)
        if (this.type === 'market') this.advice('market-buy', price, this.triggerDB.amount)
        this.close()
      }

      // buy for take profit

      // if price reaches or goes below the take profit price, then
      // we close the position with a sell order
      if (price <= this.takeProfitPrice) {
        if (this.type === 'limit') this.advice('limit-buy', price, this.triggerDB.amount)
        if (this.type === 'market') this.advice('market-buy', price, this.triggerDB.amount)
        this.close()
      }
    } else if (this.action === 'sell') {
      // if we go long, then we place sell orders to close our position

      // sell for stoploss

      // if price reaches or goes above the stop loss price, then
      // we close the position with a sell order
      if (price <= this.stopLossPrice) {
        if (this.type === 'limit') this.advice('limit-sell', price, this.triggerDB.amount)
        if (this.type === 'market') this.advice('market-sell', price, this.triggerDB.amount)
        this.close()
      }

      // sell for take profit

      // if price reaches or goes above the take profit price, then
      // we close the position with a sell order
      if (price >= this.takeProfitPrice) {
        if (this.type === 'limit') this.advice('limit-sell', price, this.triggerDB.amount)
        if (this.type === 'market') this.advice('market-sell', price, this.triggerDB.amount)
        this.close()
      }
    }


  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}

