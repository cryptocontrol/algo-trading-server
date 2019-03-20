import { Trade } from 'ccxt'

import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'


export default class TakeProfitTrigger extends BaseTrigger {
  constructor (triggerDB: Triggers) {
    super(triggerDB, 'Take Profit')
  }


  onTrade (trade: Trade) {
    if (!this.isLive) return
    const { price } = trade

    // if price reaches or goes above the take profit price, then
    // we close the position
    if (price >= this.triggerDB.targetPrice) {
      const targetPrice = Math.max(this.triggerDB.targetPrice, price)
      this.advice('close-position', targetPrice, this.triggerDB.targetVolume)
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
