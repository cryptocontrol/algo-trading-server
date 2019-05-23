import { Trade } from 'ccxt'

import { ICandle } from 'src/interfaces'
import BaseTrigger from './BaseTrigger'
import Triggers from 'src/database/models/triggers'


/**
 * A stop loss buy trigger, triggers a buy market order when the price exceeds a
 * certain point.
 */
export default class StopLossBuyTrigger extends BaseTrigger {
  constructor (triggerDB: Triggers) {
    super(triggerDB, 'Stop Loss Buy')
  }


  onTrade (trade: Trade) {
    if (!this.isLive) return
    const { price } = trade

    // if price reaches or goes below the stop loss price, then
    // we close the position with a market order
    if (price >= this.triggerDB.targetPrice) {
      this.advice('close-position', price, this.triggerDB.targetVolume)
      this.close()
    }
  }


  onCandle (_candle: ICandle) {
    // do nothing
  }
}
