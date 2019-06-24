import { Trade } from 'ccxt'

import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'


/**
 * A stop loss trigger, triggers a buy/sell order when the price exceeds above or drops below a
 * certain point.
 */
export default class StopLossTrigger extends BaseTrigger {
  action: 'buy' | 'sell'
  type: 'market' | 'limit'


  constructor (trigger: Triggers) {
    super(trigger, 'Stop Loss')

    const params = JSON.parse(trigger.params)
    this.action = params.action
    this.type = params.type

    if (params.action !== 'buy' || params.action !== 'sell') throw new Error('bad/missing action')
    if (params.type !== 'market' || params.type !== 'limit') throw new Error('bad/missing type')
  }


  onTrade (trade: Trade) {
    if (!this.isLive) return
    const { price } = trade

    // if price reaches or goes below the stop loss price, then
    // we close the position with a buy order
    if (this.action === 'buy' && price >= this.triggerDB.targetPrice) {
      if (this.type === 'limit') this.advice('limit-buy', price, this.triggerDB.targetVolume)
      if (this.type === 'market') this.advice('market-buy', price, this.triggerDB.targetVolume)
      this.close()
    }

    // if price reaches or goes above the stop loss price, then
    // we close the position with a sell order
    if (this.action === 'sell' && price >= this.triggerDB.targetPrice) {
      if (this.type === 'limit') this.advice('limit-sell', price, this.triggerDB.targetVolume)
      if (this.type === 'market') this.advice('market-sell', price, this.triggerDB.targetVolume)
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
