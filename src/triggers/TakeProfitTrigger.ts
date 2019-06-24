import { Trade } from 'ccxt'

import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'


export default class TakeProfitTrigger extends BaseTrigger {
  action: 'buy' | 'sell'
  type: 'market' | 'limit'


  constructor (trigger: Triggers) {
    super(trigger, 'Take Profit')

    const params = JSON.parse(trigger.params)
    this.action = params.action
    this.type = params.type
  }


  onTrade (trade: Trade) {
    if (!this.isLive) return
    const { price } = trade

    // if price reaches or goes below the take profie price, then
    // we close the position with a sell order
    if (this.action === 'buy' && price >= this.triggerDB.targetPrice) {
      if (this.type === 'limit') this.advice('limit-sell', price, this.triggerDB.targetVolume)
      if (this.type === 'market') this.advice('market-sell', price, this.triggerDB.targetVolume)
      this.close()
    }

    // if price reaches or goes above the take profie price, then
    // we close the position with a sell order
    if (this.action === 'sell' && price >= this.triggerDB.targetPrice) {
      if (this.type === 'limit') this.advice('limit-buy', price, this.triggerDB.targetVolume)
      if (this.type === 'market') this.advice('market-buy', price, this.triggerDB.targetVolume)
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
